# OpenAI Proxy Server

## ⚠️ IMPORTANT: Use This for Security

This proxy server keeps your OpenAI API key secure by handling all API requests on the backend.

## Quick Start

### 1. Create `.env` file

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-actual-key-here
PORT=3002
```

### 2. Install Dependencies

```bash
npm install express cors dotenv
```

### 3. Start Server

```bash
node openai-proxy.js
```

Or from project root:
```bash
npm run proxy
```

## Endpoints

### Health Check
```bash
GET /health
```

Returns:
```json
{"status":"ok","service":"openai-proxy"}
```

### Chat Completions
```bash
POST /api/chat/completions
Content-Type: application/json

{
  "model": "gpt-4o",
  "messages": [...],
  "temperature": 0.7,
  "max_tokens": 1000
}
```

### Embeddings
```bash
POST /api/embeddings
Content-Type: application/json

{
  "input": "text to embed",
  "model": "text-embedding-3-small"
}
```

## Security Features

- ✅ API key stored on server only
- ✅ CORS enabled for local development
- ✅ No API key exposure to frontend
- ✅ Ready for production deployment

## Testing

```bash
# Test health endpoint
curl http://localhost:3002/health

# Test chat completions
curl -X POST http://localhost:3002/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "Hello!"}],
    "max_tokens": 50
  }'
```

## Production Deployment

### Render.com (Recommended)

1. Create new Web Service
2. Connect your repo
3. Set build command: `npm install`
4. Set start command: `node server/openai-proxy.js`
5. Add environment variable: `OPENAI_API_KEY`

### Railway.app

```bash
railway login
railway init
railway up
railway variables set OPENAI_API_KEY=sk-your-key
```

### Environment Variables

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key

**Optional:**
- `PORT` - Server port (default: 3002)
- `NODE_ENV` - Environment (development/production)

## Troubleshooting

### Port already in use

```bash
# Find process using port 3002
lsof -i :3002

# Kill it
kill -9 <PID>
```

### API key not found

Make sure `server/.env` exists and contains:
```env
OPENAI_API_KEY=sk-...
```

### CORS errors

The proxy has CORS enabled by default. If you still see errors:
1. Check the proxy is running
2. Verify the frontend is using the correct proxy URL
3. Check browser console for specific error messages

## Files in This Directory

- `openai-proxy.js` - **Main proxy server (USE THIS)**
- `.env.example` - Environment template
- `index.js` - Legacy server (deprecated)
- `qdrant-server.js` - Qdrant integration (separate)
- `README.md` - Qdrant server documentation

## See Also

- `START_HERE.md` - Complete setup guide
- `FRONTEND_UPDATED.md` - Frontend changes
- `SECURITY_WARNING.md` - Security details
