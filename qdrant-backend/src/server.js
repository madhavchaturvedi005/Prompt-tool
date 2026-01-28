import express from 'express';
import cors from 'cors';
import { CONFIG, validateConfig } from './config.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
import healthRoutes from './routes/health.js';
import promptsRoutes from './routes/prompts.js';

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
app.use(express.json());
app.use(requestLogger);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/prompts', promptsRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const server = app.listen(CONFIG.port, () => {
  console.log('');
  console.log('🚀 ========================================');
  console.log('🚀 Qdrant Proxy Server Started');
  console.log('🚀 ========================================');
  console.log(`📍 Server URL: http://localhost:${CONFIG.port}`);
  console.log(`📊 Qdrant URL: ${CONFIG.qdrant.url}`);
  console.log(`🔑 API Key: ${CONFIG.qdrant.apiKey ? '✓ Configured' : '✗ Missing'}`);
  console.log(`📦 Collection: ${CONFIG.qdrant.collectionName}`);
  console.log(`🌍 Environment: ${CONFIG.nodeEnv}`);
  console.log(`🔓 CORS Origins: ${CONFIG.cors.origins.join(', ')}`);
  console.log('🚀 ========================================');
  console.log('');
  console.log('📝 Available endpoints:');
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/health/collection`);
  console.log(`   POST /api/prompts/search`);
  console.log(`   GET  /api/prompts/featured`);
  console.log(`   GET  /api/prompts/:id/similar`);
  console.log(`   GET  /api/prompts/category/:category`);
  console.log(`   PATCH /api/prompts/:id/stats`);
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
