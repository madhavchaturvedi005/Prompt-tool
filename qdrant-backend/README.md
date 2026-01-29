# Qdrant Backend Server

A dedicated backend proxy server for Qdrant vector database operations. This server handles all Qdrant interactions, generates embeddings using OpenAI, and provides a REST API for the frontend.

## 📁 Project Structure

```
qdrant-backend/
├── src/
│   ├── config.js                 # Configuration management
│   ├── server.js                 # Main server file
│   ├── services/
│   │   ├── qdrantService.js     # Qdrant client wrapper
│   │   └── embeddingService.js  # OpenAI embedding generation
│   ├── routes/
│   │   ├── health.js            # Health check endpoints
│   │   └── prompts.js           # Prompt-related endpoints
│   └── middleware/
│       ├── errorHandler.js      # Error handling
│       └── logger.js            # Request logging
├── .env.example                  # Environment variables template
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd qdrant-backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Qdrant Configuration
QDRANT_URL=https://your-instance.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=https://promptea.dev,https://www.promptea.dev,http://localhost:5173,http://localhost:8080
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📡 API Endpoints

### Health Check

**GET** `/api/health`

Returns server status and configuration.

**Response:**
```json
{
  "status": "ok",
  "message": "Qdrant proxy server is running",
  "qdrantUrl": "https://your-instance.qdrant.io",
  "timestamp": "2024-01-28T12:00:00.000Z",
  "version": "1.0.0"
}
```

### Collection Info

**GET** `/api/health/collection`

Returns Qdrant collection information.

### Search Prompts

**POST** `/api/prompts/search`

Search prompts using semantic search or filters.

**Request Body:**
```json
{
  "query": "code review best practices",
  "category": "coding",
  "tags": ["quality", "security"],
  "difficulty": "intermediate",
  "featured": true,
  "limit": 20,
  "offset": 0,
  "threshold": 0.3
}
```

**Response:**
```json
{
  "prompts": [...],
  "total": 15,
  "hasMore": false
}
```

### Get Featured Prompts

**GET** `/api/prompts/featured?limit=10`

Returns featured/trending prompts.

### Get Similar Prompts

**GET** `/api/prompts/:id/similar?limit=5`

Finds prompts similar to the specified prompt ID.

### Get Prompts by Category

**GET** `/api/prompts/category/:category?limit=20&offset=0`

Returns prompts filtered by category.

### Update Prompt Stats

**PATCH** `/api/prompts/:id/stats`

Updates engagement statistics for a prompt.

**Request Body:**
```json
{
  "action": "star" | "use" | "copy"
}
```

## 🏗️ Architecture

### Services

#### QdrantService
Handles all Qdrant database operations:
- Search with vector similarity
- Scroll through collections
- Retrieve specific prompts
- Update prompt payloads

#### EmbeddingService
Manages OpenAI embedding generation:
- Single text embedding
- Batch text embeddings
- Error handling and retries

### Middleware

#### Request Logger
Logs all incoming requests and responses with timing information.

#### Error Handler
Catches and formats errors appropriately for development and production.

## 🔧 Configuration

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `QDRANT_URL` | Yes | Qdrant instance URL |
| `QDRANT_API_KEY` | Yes | Qdrant API key |
| `OPENAI_API_KEY` | Yes | OpenAI API key for embeddings |
| `PORT` | No | Server port (default: 3001) |
| `NODE_ENV` | No | Environment (development/production) |
| `ALLOWED_ORIGINS` | No | CORS allowed origins (comma-separated) |

### CORS Configuration

By default, the server allows requests from:
- `http://localhost:5173` (Vite default)
- `http://localhost:8080`
- `http://localhost:3000`

To add more origins, update the `ALLOWED_ORIGINS` environment variable.

## 🧪 Testing

Test the server is running:

```bash
curl http://localhost:3001/api/health
```

Test search functionality:

```bash
curl -X POST http://localhost:3001/api/prompts/search \
  -H "Content-Type: application/json" \
  -d '{"query": "code review", "limit": 5}'
```

## 📊 Logging

The server provides detailed logging:

- 📥 Incoming requests
- ✅ Successful responses (status < 400)
- ❌ Error responses (status >= 400)
- ⏱️ Response times
- 🔍 Search operations
- 📝 Embedding generation

## 🐛 Troubleshooting

### Server won't start

**Problem:** Port already in use

**Solution:**
```bash
# Find process using port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in .env
PORT=3002
```

### Configuration errors

**Problem:** Missing environment variables

**Solution:** Check that all required variables are set in `.env`:
- `QDRANT_URL`
- `QDRANT_API_KEY`
- `OPENAI_API_KEY`

### Qdrant connection errors

**Problem:** Cannot connect to Qdrant

**Solution:**
1. Verify your Qdrant URL is correct
2. Check that your API key is valid
3. Ensure your Qdrant instance is running
4. Check network connectivity

### OpenAI API errors

**Problem:** Embedding generation fails

**Solution:**
1. Verify your OpenAI API key is valid
2. Check your OpenAI account has credits
3. Ensure you have access to the embedding model

## 🚀 Deployment

### Option 1: Railway

1. Create a new project on [Railway](https://railway.app)
2. Connect your GitHub repository
3. Set environment variables in Railway dashboard
4. Deploy

### Option 2: Heroku

1. Create a new Heroku app
2. Set environment variables:
   ```bash
   heroku config:set QDRANT_URL=your_url
   heroku config:set QDRANT_API_KEY=your_key
   heroku config:set OPENAI_API_KEY=your_key
   ```
3. Deploy:
   ```bash
   git push heroku main
   ```

### Option 3: Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY src ./src
EXPOSE 3001
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t qdrant-backend .
docker run -p 3001:3001 --env-file .env qdrant-backend
```

## 📝 Development

### Adding New Endpoints

1. Create a new route file in `src/routes/`
2. Import and use in `src/server.js`
3. Add documentation to this README

### Modifying Services

Services are located in `src/services/`:
- `qdrantService.js` - Qdrant operations
- `embeddingService.js` - OpenAI embeddings

### Adding Middleware

Middleware is located in `src/middleware/`:
- `errorHandler.js` - Error handling
- `logger.js` - Request logging

## 🔒 Security

- API keys are never exposed to the frontend
- CORS is configured to only allow specific origins
- Error messages don't leak sensitive information in production
- All requests are logged for monitoring

## 📄 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the logs for error messages
3. Verify your configuration
4. Check Qdrant and OpenAI service status
