import express from 'express';
import cors from 'cors';
import { CONFIG, validateConfig } from './config.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.js';
import promptsRoutes from './routes/prompts.js';
import openaiRoutes from './routes/openai.js';

// Validate configuration before starting
if (!validateConfig()) {
  console.error('❌ Server cannot start due to configuration errors');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: CONFIG.cors.origins,
  credentials: CONFIG.cors.credentials
}));
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/prompts', promptsRoutes);
app.use('/api', openaiRoutes); // OpenAI proxy routes

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(CONFIG.port, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀 Qdrant + OpenAI Proxy Server Started');
  console.log('🚀 ========================================');
  console.log(`📍 Server URL: http://localhost:${CONFIG.port}`);
  console.log(`📊 Qdrant URL: ${CONFIG.qdrant.url}`);
  console.log(`🔑 Qdrant API Key: ${CONFIG.qdrant.apiKey ? '✓ Configured' : '✗ Missing'}`);
  console.log(`🤖 OpenAI API Key: ${CONFIG.openai.apiKey ? '✓ Configured' : '✗ Missing'}`);
  console.log(`📦 Collection: ${CONFIG.qdrant.collectionName}`);
  console.log(`🌍 Environment: ${CONFIG.nodeEnv}`);
  console.log(`🔓 CORS Origins: ${CONFIG.cors.origins.join(', ')}`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('📝 Available endpoints:');
  console.log('   Qdrant/Prompts:');
  console.log(`     GET  /api/health`);
  console.log(`     GET  /api/health/collection`);
  console.log(`     POST /api/prompts/search`);
  console.log(`     GET  /api/prompts/featured`);
  console.log(`     GET  /api/prompts/:id/similar`);
  console.log(`     GET  /api/prompts/category/:category`);
  console.log(`     PATCH /api/prompts/:id/stats`);
  console.log('   OpenAI Proxy:');
  console.log(`     GET  /api/health (OpenAI proxy health)`);
  console.log(`     POST /api/chat/completions`);
  console.log(`     POST /api/embeddings`);
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

export default app;
