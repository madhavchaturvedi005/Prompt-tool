import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { QdrantClient } from '@qdrant/js-client-rest';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Qdrant client
const qdrantClient = new QdrantClient({
  url: process.env.NEXT_PUBLIC_QDRANT_URL || process.env.VITE_QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY || process.env.VITE_QDRANT_API_KEY,
});

const COLLECTION_NAME = 'prompts';

// Generate embeddings using OpenAI
async function generateEmbedding(text) {
  try {
    const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-3-small',
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    throw error;
  }
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Qdrant proxy server is running' });
});

// Get collection info
app.get('/api/collection/info', async (req, res) => {
  try {
    const info = await qdrantClient.getCollection(COLLECTION_NAME);
    res.json(info);
  } catch (error) {
    console.error('Collection info error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Search prompts
app.post('/api/prompts/search', async (req, res) => {
  try {
    const { query, category, tags, difficulty, featured, limit = 20, offset = 0, threshold = 0.3 } = req.body;

    let result;

    if (query && query.trim()) {
      // Semantic search with query
      const queryEmbedding = await generateEmbedding(query);

      // Build filter conditions
      const filterConditions = [];

      if (category) {
        filterConditions.push({
          key: 'category',
          match: { value: category },
        });
      }

      if (tags && tags.length > 0) {
        filterConditions.push({
          key: 'tags',
          match: { any: tags },
        });
      }

      if (difficulty) {
        filterConditions.push({
          key: 'difficulty',
          match: { value: difficulty },
        });
      }

      if (featured !== undefined) {
        filterConditions.push({
          key: 'featured',
          match: { value: featured },
        });
      }

      const searchResult = await qdrantClient.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit,
        offset,
        score_threshold: threshold,
        filter: filterConditions.length > 0 ? {
          must: filterConditions,
        } : undefined,
        with_payload: true,
      });

      result = {
        prompts: searchResult.map(r => r.payload),
        total: searchResult.length,
        hasMore: searchResult.length === limit,
      };
    } else {
      // Category-based browsing or general scroll
      const filter = {};
      const filterConditions = [];

      if (category) {
        filterConditions.push({
          key: 'category',
          match: { value: category },
        });
      }

      if (featured !== undefined) {
        filterConditions.push({
          key: 'featured',
          match: { value: featured },
        });
      }

      if (filterConditions.length > 0) {
        filter.must = filterConditions;
      }

      const scrollResult = await qdrantClient.scroll(COLLECTION_NAME, {
        filter: Object.keys(filter).length > 0 ? filter : undefined,
        limit,
        offset,
        with_payload: true,
      });

      result = {
        prompts: scrollResult.points.map(p => p.payload),
        total: scrollResult.points.length,
        hasMore: scrollResult.points.length === limit,
      };
    }

    res.json(result);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get featured prompts
app.get('/api/prompts/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const result = await qdrantClient.scroll(COLLECTION_NAME, {
      filter: {
        must: [
          {
            key: 'featured',
            match: { value: true },
          },
        ],
      },
      limit: parseInt(limit),
      with_payload: true,
    });

    const prompts = result.points.map(point => point.payload);
    res.json(prompts);
  } catch (error) {
    console.error('Featured prompts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get similar prompts
app.get('/api/prompts/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    // Get the target prompt
    const targetPrompt = await qdrantClient.retrieve(COLLECTION_NAME, {
      ids: [id],
      with_payload: true,
      with_vector: true,
    });

    if (targetPrompt.length === 0) {
      return res.json([]);
    }

    // Search for similar prompts
    const searchResult = await qdrantClient.search(COLLECTION_NAME, {
      vector: targetPrompt[0].vector,
      limit: parseInt(limit) + 1, // +1 to exclude the target prompt itself
      with_payload: true,
    });

    // Filter out the target prompt and return similar ones
    const similarPrompts = searchResult
      .filter(result => result.id !== id)
      .slice(0, parseInt(limit))
      .map(result => result.payload);

    res.json(similarPrompts);
  } catch (error) {
    console.error('Similar prompts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update prompt stats
app.patch('/api/prompts/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { stars, uses } = req.body;

    const updatePayload = {
      updatedAt: new Date().toISOString(),
    };

    if (stars !== undefined) updatePayload.stars = stars;
    if (uses !== undefined) updatePayload.uses = uses;

    await qdrantClient.setPayload(COLLECTION_NAME, {
      payload: updatePayload,
      points: [id],
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Update stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Qdrant proxy server running on http://localhost:${PORT}`);
  console.log(`📊 Connected to Qdrant: ${process.env.NEXT_PUBLIC_QDRANT_URL || process.env.VITE_QDRANT_URL}`);
});

export default app;