# Qdrant Backend Setup Guide

## Overview

The Qdrant backend is now in a separate, dedicated folder (`qdrant-backend/`) with its own dependencies, configuration, and structure. This makes it easier to develop, deploy, and maintain independently from the frontend.

## 📁 Folder Structure

```
prompt-studio/
├── qdrant-backend/          # Separate backend server
│   ├── src/
│   │   ├── config.js        # Configuration
│   │   ├── server.js        # Main server
│   │   ├── services/        # Business logic
│   │   ├── routes/          # API endpoints
│   │   └── middleware/      # Express middleware
│   ├── .env.example         # Environment template
│   ├── package.json         # Backend dependencies
│   ├── setup.sh             # Setup script
│   └── README.md            # Backend documentation
├── src/                     # Frontend code
├── package.json             # Frontend dependencies
└── ...
```

## 🚀 Quick Setup

### Step 1: Navigate to Backend Folder

```bash
cd qdrant-backend
```

### Step 2: Run Setup Script

```bash
./setup.sh
```

This will:
- Check Node.js installation
- Install dependencies
- Create `.env` file from template

### Step 3: Configure Environment

Edit `qdrant-backend/.env`:

```env
# Qdrant Configuration
QDRANT_URL=https://8b745f0a-0926-468e-8989-e40430834d4f.us-east4-0.gcp.cloud.qdrant.io
QDRANT_API_KEY=your_qdrant_api_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:8080,http://localhost:3000
```

### Step 4: Start the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 🎯 Running from Root Directory

You can also run the backend from the root project directory:

### Start Backend Only

```bash
npm run qdrant-dev
```

### Start Both Frontend and Backend

```bash
npm run dev:full
```

This will start:
- Backend on `http://localhost:3001`
- Frontend on `http://localhost:5173`

## 📡 Testing the Backend

### 1. Health Check

```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Qdrant proxy server is running",
  "qdrantUrl": "https://your-instance.qdrant.io",
  "timestamp": "2024-01-28T12:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Search Prompts

```bash
curl -X POST http://localhost:3001/api/prompts/search \
  -H "Content-Type: application/json" \
  -d '{"query": "code review", "limit": 5}'
```

### 3. Get Featured Prompts

```bash
curl http://localhost:3001/api/prompts/featured?limit=10
```

## 🏗️ Architecture Benefits

### Separation of Concerns
- **Frontend**: React/Vite application
- **Backend**: Express.js API server
- Each can be developed, tested, and deployed independently

### Security
- API keys never exposed to frontend
- Backend acts as secure proxy
- CORS protection

### Scalability
- Backend can be scaled independently
- Can add caching, rate limiting, etc.
- Easy to add more services

### Maintainability
- Clear folder structure
- Separate dependencies
- Independent versioning

## 📦 Dependencies

The backend has its own `package.json` with minimal dependencies:

```json
{
  "dependencies": {
    "@qdrant/js-client-rest": "^1.16.2",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2"
  }
}
```

## 🔧 Development Workflow

### Recommended Setup

**Terminal 1 - Backend:**
```bash
cd qdrant-backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Single Command Option

From root directory:
```bash
npm run dev:full
```

## 🚀 Deployment

### Backend Deployment Options

1. **Railway** (Recommended)
   - Connect GitHub repo
   - Set environment variables
   - Auto-deploy on push

2. **Heroku**
   - Create new app
   - Set config vars
   - Deploy via Git

3. **Vercel** (Serverless)
   - Deploy as serverless functions
   - Configure environment variables

4. **Docker**
   - Build container
   - Deploy to any container platform

### Frontend Configuration

After deploying backend, update frontend API URL in `src/lib/api/prompts.ts`:

```typescript
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://your-backend.railway.app/api'
  : 'http://localhost:3001/api';
```

## 📝 API Endpoints

All endpoints are documented in `qdrant-backend/README.md`:

- `GET /api/health` - Health check
- `GET /api/health/collection` - Collection info
- `POST /api/prompts/search` - Search prompts
- `GET /api/prompts/featured` - Featured prompts
- `GET /api/prompts/:id/similar` - Similar prompts
- `GET /api/prompts/category/:category` - Category browse
- `PATCH /api/prompts/:id/stats` - Update stats

## 🐛 Troubleshooting

### Backend won't start

**Check Node.js version:**
```bash
node --version  # Should be 18+
```

**Check port availability:**
```bash
lsof -ti:3001 | xargs kill -9
```

**Verify environment variables:**
```bash
cd qdrant-backend
cat .env
```

### Frontend can't connect to backend

**Check backend is running:**
```bash
curl http://localhost:3001/api/health
```

**Check CORS configuration:**
Ensure your frontend URL is in `ALLOWED_ORIGINS` in backend `.env`

### No prompts returned

**Check Qdrant collection:**
```bash
curl http://localhost:3001/api/health/collection
```

**Populate collection:**
```bash
cd ..  # Go to root directory
npm run setup:qdrant
```

## 📊 Monitoring

The backend provides detailed logging:

```
📥 POST /api/prompts/search
🔍 Search request: { query: 'code review', limit: 20 }
📝 Generating embedding for query: code review
🎯 Searching with filters: []
✅ Search completed: 15 prompts found
✅ POST /api/prompts/search - 200 (1234ms)
```

## 🔒 Security Best Practices

1. **Never commit `.env` file**
   - Already in `.gitignore`
   - Use `.env.example` as template

2. **Use environment variables**
   - All sensitive data in `.env`
   - Different values for dev/prod

3. **Configure CORS properly**
   - Only allow trusted origins
   - Update for production URLs

4. **Keep dependencies updated**
   ```bash
   cd qdrant-backend
   npm audit
   npm update
   ```

## 📚 Additional Resources

- [Backend README](qdrant-backend/README.md) - Detailed backend documentation
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

## ✅ Checklist

Before starting development:

- [ ] Backend dependencies installed (`cd qdrant-backend && npm install`)
- [ ] `.env` file configured with API keys
- [ ] Backend server starts successfully
- [ ] Health check endpoint responds
- [ ] Frontend can connect to backend
- [ ] Search functionality works

## 🎉 Summary

Your Qdrant backend is now:
- ✅ In a separate, organized folder
- ✅ With its own dependencies and configuration
- ✅ Easy to develop and deploy independently
- ✅ Properly structured with services, routes, and middleware
- ✅ Ready for production deployment

Start the backend with `npm run qdrant-dev` and you're ready to go!
