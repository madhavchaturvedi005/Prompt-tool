# Qdrant Library Setup Guide

## Overview

Your PromptLab application now has a fully functional library page powered by Qdrant vector database. The system uses a backend proxy server to handle Qdrant operations securely.

## Architecture

```
Frontend (Browser)
    ↓
Backend Proxy Server (Node.js/Express)
    ↓
Qdrant Cloud Instance
    ↓
OpenAI API (for embeddings)
```

## Quick Start

### 1. Start the Qdrant Backend Server

Open a new terminal and run:

```bash
npm run qdrant-server
```

You should see:
```
🚀 ========================================
🚀 Qdrant Proxy Server Started
🚀 ========================================
📍 Server URL: http://localhost:3001
📊 Qdrant URL: https://your-instance.qdrant.io
🔑 API Key: ✓ Configured
📦 Collection: prompts
🚀 ========================================
```

### 2. Start the Frontend

In another terminal, run:

```bash
npm run dev
```

### 3. Or Run Both Together

```bash
npm run dev:full
```

This will start both the backend and frontend simultaneously.

## Features

### ✅ What's Working

1. **Semantic Search**: Search prompts using natural language
2. **Category Filtering**: Browse by coding, writing, business, etc.
3. **Featured Prompts**: Display trending/featured prompts
4. **Similar Prompts**: Find related prompts based on content
5. **Engagement Tracking**: Track stars, uses, and copies
6. **Fallback System**: Gracefully falls back to mock data if server is down

### 🔧 Technical Details

- **Backend Server**: `server/qdrant-server.js`
- **Frontend API**: `src/lib/api/prompts.ts`
- **Port**: 3001 (configurable via `QDRANT_SERVER_PORT`)
- **Collection**: `prompts`
- **Embedding Model**: OpenAI `text-embedding-3-small`

## API Endpoints

All endpoints are available at `http://localhost:3001/api/`

- `GET /health` - Server health check
- `POST /prompts/search` - Search prompts
- `GET /prompts/featured` - Get featured prompts
- `GET /prompts/:id/similar` - Get similar prompts
- `GET /prompts/category/:category` - Get prompts by category
- `PATCH /prompts/:id/stats` - Update prompt statistics
- `GET /collection/info` - Get Qdrant collection info

## Environment Variables

Make sure these are set in your `.env` file:

```env
# Qdrant Configuration
VITE_QDRANT_URL=https://8b745f0a-0926-468e-8989-e40430834d4f.us-east4-0.gcp.cloud.qdrant.io
VITE_QDRANT_API_KEY=your_api_key_here

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_key_here

# Server Port (optional)
QDRANT_SERVER_PORT=3001
```

## Populating Data

If your Qdrant collection is empty, you can populate it with sample prompts:

```bash
npm run setup:qdrant
```

This will:
1. Create the `prompts` collection
2. Parse prompts from `public/PROMPTS.md`
3. Generate embeddings using OpenAI
4. Upload prompts to Qdrant

## Troubleshooting

### Backend server not starting

**Problem**: Port 3001 is already in use

**Solution**: 
```bash
# Find and kill the process using port 3001
lsof -ti:3001 | xargs kill -9

# Or change the port in .env
QDRANT_SERVER_PORT=3002
```

### Frontend shows mock data

**Problem**: Backend server is not running

**Solution**: Start the backend server first
```bash
npm run qdrant-server
```

### CORS errors

**Problem**: Frontend running on different port

**Solution**: Update CORS configuration in `server/qdrant-server.js`:
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:YOUR_PORT'],
  credentials: true
}));
```

### No prompts returned

**Problem**: Qdrant collection is empty

**Solution**: Run the setup script
```bash
npm run setup:qdrant
```

### OpenAI API errors

**Problem**: Invalid or missing OpenAI API key

**Solution**: 
1. Get an API key from https://platform.openai.com/api-keys
2. Add it to your `.env` file
3. Restart the backend server

## Development Workflow

### Recommended Setup

1. **Terminal 1**: Backend server
   ```bash
   npm run qdrant-server
   ```

2. **Terminal 2**: Frontend dev server
   ```bash
   npm run dev
   ```

3. **Terminal 3**: Available for other commands

### Single Command Option

```bash
npm run dev:full
```

This runs both servers with `concurrently`.

## Production Deployment

### Backend Deployment

1. Deploy `server/qdrant-server.js` to:
   - Heroku
   - Railway
   - Render
   - Vercel (serverless)
   - Any Node.js hosting

2. Set environment variables on your hosting platform

3. Note your backend URL (e.g., `https://your-app.railway.app`)

### Frontend Configuration

Update API URLs in `src/lib/api/prompts.ts`:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend.railway.app/api'
  : 'http://localhost:3001/api';
```

## Files Created/Modified

### New Files
- `server/qdrant-server.js` - Backend proxy server
- `server/README.md` - Server documentation
- `QDRANT_SETUP.md` - This file

### Modified Files
- `src/lib/api/prompts.ts` - Updated to use backend proxy
- `package.json` - Added `qdrant-server` and `dev:full` scripts

## Next Steps

1. ✅ Start the backend server
2. ✅ Start the frontend
3. ✅ Navigate to the Library page
4. ✅ Test search functionality
5. ✅ Test category filtering
6. ✅ Verify featured prompts display

## Support

If you encounter any issues:

1. Check the backend server logs
2. Check the browser console for errors
3. Verify environment variables are set
4. Ensure Qdrant collection has data
5. Test the `/api/health` endpoint

## Summary

Your Qdrant library system is now fully functional! The backend server handles all Qdrant operations securely, while the frontend provides a beautiful interface for browsing and searching prompts. The system includes automatic fallback to mock data if the backend is unavailable, ensuring a smooth user experience.
