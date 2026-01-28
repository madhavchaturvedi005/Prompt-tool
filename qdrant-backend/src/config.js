import { config } from 'dotenv';

// Load environment variables
config();

export const CONFIG = {
  // Server configuration
  port: process.env.PORT || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Qdrant configuration
  qdrant: {
    url: process.env.QDRANT_URL || process.env.VITE_QDRANT_URL,
    apiKey: process.env.QDRANT_API_KEY || process.env.VITE_QDRANT_API_KEY,
    collectionName: 'prompts',
  },
  
  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY,
    embeddingModel: 'text-embedding-3-small',
  },
  
  // CORS configuration
  cors: {
    origins: process.env.ALLOWED_ORIGINS 
      ? process.env.ALLOWED_ORIGINS.split(',')
      : ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
  },
};

// Validate required configuration
export function validateConfig() {
  const errors = [];
  
  if (!CONFIG.qdrant.url) {
    errors.push('QDRANT_URL is required');
  }
  
  if (!CONFIG.qdrant.apiKey) {
    errors.push('QDRANT_API_KEY is required');
  }
  
  if (!CONFIG.openai.apiKey) {
    errors.push('OPENAI_API_KEY is required');
  }
  
  if (errors.length > 0) {
    console.error('❌ Configuration errors:');
    errors.forEach(error => console.error(`   - ${error}`));
    return false;
  }
  
  return true;
}
