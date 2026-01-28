import express from 'express';
import { qdrantService } from '../services/qdrantService.js';
import { CONFIG } from '../config.js';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Qdrant proxy server is running',
    qdrantUrl: CONFIG.qdrant.url,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Collection info endpoint
router.get('/collection', async (req, res) => {
  try {
    const info = await qdrantService.getCollectionInfo();
    res.json(info);
  } catch (error) {
    console.error('Collection info error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
