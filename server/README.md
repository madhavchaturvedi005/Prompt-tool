# Qdrant Backend Server

This is a separate backend server that acts as a proxy between your frontend application and Qdrant cloud instance. It's necessary because Qdrant cannot be accessed directly from the browser due to CORS restrictions.

## Why Do We Need This?

- **CORS Protection**: Qdrant cloud instances don't allow direct browser access for security reasons
- **API Key Security**: Keeps your Qdrant API key secure on the server side
- **OpenAI Integration**: Generates embeddings for semantic search using OpenAI API
- **Better Performance**: Server-side processing is faster and more reliable

## Setup

### 1. Install Dependencies

Make sure you have all dependencies installed:

```bash
npm install
```

### 2. Configure Environment Variables

Ensure your `.env` file has the following variables:

```env
# Qdrant Configuration
VITE_QDRANT_URL=https://your-qdrant-instance.qdrant.io
VITE_QDRANT_API_KEY=your_qdrant_api_key

# OpenAI Configuration (for embeddings)
VITE_OPENAI_API_KEY=your_openai_api_key

# Server Port (optional)
QDRANT_SERVER_PORT=3001
```

### 3. Start the Server

You have three options:

#### Option 1: Run Qdrant Server Only
```bash
npm run qdrant-server
```

#### Option 2: Run Both Frontend and Backend Together
```bash
npm run dev:full
```

#### Option 3: Run Separately (in different terminals)

Terminal 1 - Backend:
```bash
npm run qdrant-server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## API Endpoints

The server provides the following endpoints:

### Health Check
```
GET /api/health
```
Returns server status and configuration info.

### Search Prompts
```
POST /api/prompts/search
Body: {
  query?: string,
  category?: string,
  tags?: string[],
  difficulty?: string,
  featured?: boolean,
  limit?: number,
  offset?: number,
  threshold?: number
}
```
Performs semantic search or filtered browsing of prompts.

### Get Featured Prompts
```
GET /api/prompts/featured?limit=10
```
Returns featured/trending prompts.

### Get Similar Prompts
```
GET /api/prompts/:id/similar?limit=5
```
Finds prompts similar to the specified prompt ID.

### Get Prompts by Category
```
GET /api/prompts/category/:category?limit=20&offset=0
```
Returns prompts filtered by category.

### Update Prompt Stats
```
PATCH /api/prompts/:id/stats
Body: { action: 'star' | 'use' | 'copy' }
```
Updates engagement statistics for a prompt.

### Get Collection Info
```
GET /api/collection/info
```
Returns information about the Qdrant collection.

## How It Works

1. **Frontend** makes requests to `http://localhost:3001/api/*`
2. **Backend Server** receives the request
3. **Server** generates embeddings using OpenAI (if needed for search)
4. **Server** queries Qdrant cloud instance
5. **Server** returns results to frontend
6. **Frontend** displays the data

## Troubleshooting

### Server won't start
- Check if port 3001 is already in use
- Verify your environment variables are set correctly
- Make sure you have Node.js installed

### Connection errors
- Verify your Qdrant URL is correct
- Check that your Qdrant API key is valid
- Ensure your OpenAI API key is configured

### No prompts returned
- Check if your Qdrant collection has data
- Run the setup script: `npm run setup:qdrant`
- Verify the collection name is 'prompts'

### CORS errors
- The server is configured to allow requests from:
  - http://localhost:5173 (Vite default)
  - http://localhost:8080
  - http://localhost:3000
- If your frontend runs on a different port, update the CORS configuration in `qdrant-server.js`

## Production Deployment

For production, you'll need to:

1. Deploy this backend server to a hosting service (Heroku, Railway, Render, etc.)
2. Update the frontend API URLs to point to your deployed backend
3. Set environment variables on your hosting platform
4. Ensure CORS is configured for your production frontend URL

## Security Notes

- Never expose your Qdrant API key in the frontend
- Never expose your OpenAI API key in the frontend
- Always use environment variables for sensitive data
- Consider adding authentication to your backend endpoints in production
