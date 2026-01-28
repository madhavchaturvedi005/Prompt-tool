import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { QdrantClient } from '@qdrant/js-client-rest';

// Load environment variables
config();

const app = express();
const PORT = process.env.QDRANT_SERVER_PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Initialize Qdrant client
const qdrantUrl = process.env.VITE_QDRANT_URL || process.env.NEXT_PUBLIC_QDRANT_URL;
const qdrantApiKey = process.env.VITE_QDRANT_API_KEY || process.env.QDRANT_API_KEY;

console.log('🔧 Initializing Qdrant client...');
console.log('📍 Qdrant URL:', qdrantUrl);
console.log('🔑 API Key present:', !!qdrantApiKey);

const qdrantClient = new QdrantClient({
  url: qdrantUrl,
  apiKey: qdrantApiKey,
});

const COLLECTION_NAME = 'prompts';

// Generate embeddings using OpenAI
async function generateEmbedding(text) {
  try {
    const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || response.statusText}`);
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
  res.json({ 
    status: 'ok', 
    message: 'Qdrant proxy server is running',
    qdrantUrl: qdrantUrl,
    timestamp: new Date().toISOString()
  });
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
    const { 
      query, 
      category, 
      tags, 
      difficulty, 
      featured, 
      contributor,
      limit = 20, 
      offset = 0, 
      threshold = 0.3 
    } = req.body;

    console.log('🔍 Search request:', { query, category, limit, offset });

    let result;

    if (query && query.trim()) {
      // Semantic search with query
      console.log('📝 Generating embedding for query:', query);
      const queryEmbedding = await generateEmbedding(query);

      // Build filter conditions
      const filterConditions = [];

      if (category && category !== 'all') {
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

      if (contributor) {
        filterConditions.push({
          key: 'contributor',
          match: { value: contributor },
        });
      }

      console.log('🎯 Searching with filters:', filterConditions);

      const searchResult = await qdrantClient.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit,
        offset,
        score_threshold: threshold,
        filter: filterConditions.length > 0 ? {
          must: filterConditions,
        } : undefined,
        with_payload: true,
        with_vector: false,
      });

      result = {
        prompts: searchResult.map(r => ({
          id: r.id,
          ...r.payload,
          score: r.score
        })),
        total: searchResult.length,
        hasMore: searchResult.length === limit,
      };
    } else {
      // Category-based browsing or general scroll
      const filterConditions = [];

      if (category && category !== 'all') {
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

      if (difficulty) {
        filterConditions.push({
          key: 'difficulty',
          match: { value: difficulty },
        });
      }

      console.log('📜 Scrolling with filters:', filterConditions);

      const scrollResult = await qdrantClient.scroll(COLLECTION_NAME, {
        filter: filterConditions.length > 0 ? {
          must: filterConditions,
        } : undefined,
        limit,
        offset,
        with_payload: true,
        with_vector: false,
      });

      result = {
        prompts: scrollResult.points.map(p => ({
          id: p.id,
          ...p.payload
        })),
        total: scrollResult.points.length,
        hasMore: scrollResult.points.length === limit,
      };
    }

    console.log('✅ Search completed:', result.prompts.length, 'prompts found');
    res.json(result);
  } catch (error) {
    console.error('❌ Search error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

// Get featured prompts
app.get('/api/prompts/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    console.log('⭐ Fetching featured prompts, limit:', limit);

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
      with_vector: false,
    });

    const prompts = result.points.map(point => ({
      id: point.id,
      ...point.payload
    }));

    console.log('✅ Featured prompts found:', prompts.length);
    res.json(prompts);
  } catch (error) {
    console.error('❌ Featured prompts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get similar prompts
app.get('/api/prompts/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    console.log('🔗 Finding similar prompts for:', id);

    // Get the target prompt
    const targetPrompt = await qdrantClient.retrieve(COLLECTION_NAME, {
      ids: [id],
      with_payload: true,
      with_vector: true,
    });

    if (targetPrompt.length === 0) {
      console.log('⚠️ Target prompt not found');
      return res.json([]);
    }

    // Search for similar prompts
    const searchResult = await qdrantClient.search(COLLECTION_NAME, {
      vector: targetPrompt[0].vector,
      limit: parseInt(limit) + 1, // +1 to exclude the target prompt itself
      with_payload: true,
      with_vector: false,
    });

    // Filter out the target prompt and return similar ones
    const similarPrompts = searchResult
      .filter(result => result.id !== id)
      .slice(0, parseInt(limit))
      .map(result => ({
        id: result.id,
        ...result.payload,
        score: result.score
      }));

    console.log('✅ Similar prompts found:', similarPrompts.length);
    res.json(similarPrompts);
  } catch (error) {
    console.error('❌ Similar prompts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update prompt stats
app.patch('/api/prompts/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    console.log('📊 Updating stats for prompt:', id, 'action:', action);

    // Get current prompt data
    const currentPrompt = await qdrantClient.retrieve(COLLECTION_NAME, {
      ids: [id],
      with_payload: true,
    });

    if (currentPrompt.length === 0) {
      return res.status(404).json({ error: 'Prompt not found' });
    }

    const payload = currentPrompt[0].payload;
    const updatePayload = {
      updatedAt: new Date().toISOString(),
    };

    // Increment counters based on action
    if (action === 'star') {
      updatePayload.stars = (payload.stars || 0) + 1;
    } else if (action === 'use' || action === 'copy') {
      updatePayload.uses = (payload.uses || 0) + 1;
    }

    await qdrantClient.setPayload(COLLECTION_NAME, {
      payload: updatePayload,
      points: [id],
    });

    console.log('✅ Stats updated successfully');
    res.json({ success: true, updates: updatePayload });
  } catch (error) {
    console.error('❌ Update stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get prompts by category
app.get('/api/prompts/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    console.log('📂 Fetching prompts for category:', category);

    const result = await qdrantClient.scroll(COLLECTION_NAME, {
      filter: category !== 'all' ? {
        must: [
          {
            key: 'category',
            match: { value: category },
          },
        ],
      } : undefined,
      limit: parseInt(limit),
      offset: parseInt(offset),
      with_payload: true,
      with_vector: false,
    });

    const prompts = result.points.map(point => ({
      id: point.id,
      ...point.payload
    }));

    console.log('✅ Category prompts found:', prompts.length);
    res.json({
      prompts,
      total: prompts.length,
      hasMore: prompts.length === parseInt(limit),
    });
  } catch (error) {
    console.error('❌ Category prompts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('💥 Unhandled error:', err);
  res.status(500).json({ 
    error: 'Internal server error', 
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀 Qdrant Proxy Server Started');
  console.log('🚀 ========================================');
  console.log(`📍 Server URL: http://localhost:${PORT}`);
  console.log(`📊 Qdrant URL: ${qdrantUrl}`);
  console.log(`🔑 API Key: ${qdrantApiKey ? '✓ Configured' : '✗ Missing'}`);
  console.log(`📦 Collection: ${COLLECTION_NAME}`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('📝 Available endpoints:');
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/collection/info`);
  console.log(`   POST /api/prompts/search`);
  console.log(`   GET  /api/prompts/featured`);
  console.log(`   GET  /api/prompts/:id/similar`);
  console.log(`   GET  /api/prompts/category/:category`);
  console.log(`   PATCH /api/prompts/:id/stats`);
  console.log('');
});

export default app;
