import express from 'express';
import { qdrantService } from '../services/qdrantService.js';
import { embeddingService } from '../services/embeddingService.js';

const router = express.Router();

// Build filter conditions from request parameters
function buildFilterConditions(params) {
  const { category, tags, difficulty, featured, contributor } = params;
  const conditions = [];

  if (category && category !== 'all') {
    conditions.push({
      key: 'category',
      match: { value: category },
    });
  }

  if (tags && tags.length > 0) {
    conditions.push({
      key: 'tags',
      match: { any: tags },
    });
  }

  if (difficulty) {
    conditions.push({
      key: 'difficulty',
      match: { value: difficulty },
    });
  }

  if (featured !== undefined) {
    conditions.push({
      key: 'featured',
      match: { value: featured },
    });
  }

  if (contributor) {
    conditions.push({
      key: 'contributor',
      match: { value: contributor },
    });
  }

  return conditions;
}

// Search prompts
router.post('/search', async (req, res) => {
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
      const queryEmbedding = await embeddingService.generateEmbedding(query);

      // Build filter conditions
      const filterConditions = buildFilterConditions({ category, tags, difficulty, featured, contributor });

      console.log('🎯 Searching with filters:', filterConditions);

      const searchResult = await qdrantService.searchPrompts({
        vector: queryEmbedding,
        limit,
        offset,
        scoreThreshold: threshold,
        filter: filterConditions.length > 0 ? { must: filterConditions } : undefined,
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
      const filterConditions = buildFilterConditions({ category, tags, difficulty, featured, contributor });

      console.log('📜 Scrolling with filters:', filterConditions);

      const scrollResult = await qdrantService.scrollPrompts({
        filter: filterConditions.length > 0 ? { must: filterConditions } : undefined,
        limit,
        offset,
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
    res.status(500).json({ error: error.message });
  }
});

// Get featured prompts
router.get('/featured', async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    console.log('⭐ Fetching featured prompts, limit:', limit);

    const result = await qdrantService.scrollPrompts({
      filter: {
        must: [
          {
            key: 'featured',
            match: { value: true },
          },
        ],
      },
      limit: parseInt(limit),
      offset: 0,
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
router.get('/:id/similar', async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 5 } = req.query;

    console.log('🔗 Finding similar prompts for:', id);

    // Get the target prompt with vector
    const targetPrompt = await qdrantService.retrievePrompts([id], true);

    if (targetPrompt.length === 0) {
      console.log('⚠️ Target prompt not found');
      return res.json([]);
    }

    // Search for similar prompts
    const searchResult = await qdrantService.searchPrompts({
      vector: targetPrompt[0].vector,
      limit: parseInt(limit) + 1, // +1 to exclude the target prompt itself
      offset: 0,
      scoreThreshold: 0,
      filter: undefined,
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

// Get prompts by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    console.log('📂 Fetching prompts for category:', category);

    const result = await qdrantService.scrollPrompts({
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

// Update prompt stats
router.patch('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    console.log('📊 Updating stats for prompt:', id, 'action:', action);

    // Get current prompt data
    const currentPrompt = await qdrantService.retrievePrompts([id]);

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

    await qdrantService.updatePromptPayload(id, updatePayload);

    console.log('✅ Stats updated successfully');
    res.json({ success: true, updates: updatePayload });
  } catch (error) {
    console.error('❌ Update stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
