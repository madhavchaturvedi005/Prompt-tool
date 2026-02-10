import express from 'express';
import { CONFIG } from '../config.js';

const router = express.Router();

// Health check for OpenAI proxy
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'openai-proxy',
    timestamp: new Date().toISOString()
  });
});

// Chat Completions Proxy
router.post('/chat/completions', async (req, res) => {
  try {
    const apiKey = CONFIG.openai.apiKey;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured on server' 
      });
    }

    // Forward request to OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('OpenAI chat completions error:', error);
    res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message 
    });
  }
});

// Embeddings Proxy
router.post('/embeddings', async (req, res) => {
  try {
    const apiKey = CONFIG.openai.apiKey;
    
    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured on server' 
      });
    }

    // Forward request to OpenAI
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('OpenAI embeddings error:', error);
    res.status(500).json({ 
      error: 'Failed to generate embeddings',
      message: error.message 
    });
  }
});

export default router;
