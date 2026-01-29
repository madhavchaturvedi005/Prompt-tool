# Quick Deployment Guide

## 🚀 Deploy Qdrant Backend to Render (5 Minutes)

### Step 1: Push to GitHub ✅
Your code is already pushed to: `https://github.com/madhavchaturvedi005/Prompt-tool.git`

### Step 2: Deploy to Render

1. **Go to Render**: [https://dashboard.render.com](https://dashboard.render.com)
   - Sign up/Login (free account)

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Click "Connect a repository"
   - Authorize GitHub access
   - Select: `madhavchaturvedi005/Prompt-tool`

3. **Configure Service**
   ```
   Name: qdrant-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: qdrant-backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables** (Click "Advanced")
   ```
   NODE_ENV = production
   PORT = 3001
   QDRANT_URL = https://8b745f0a-0926-468e-8989-e40430834d4f.us-east4-0.gcp.cloud.qdrant.io
   QDRANT_API_KEY = [your-qdrant-key]
   OPENAI_API_KEY = [your-openai-key]
   ALLOWED_ORIGINS = https://promptea.dev,https://www.promptea.dev,http://localhost:5173
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - Copy your backend URL: `https://qdrant-backend-xxxx.onrender.com`

### Step 3: Update Frontend

Update your frontend `.env` file:
```env
VITE_BACKEND_URL=https://qdrant-backend-xxxx.onrender.com
```

Update `src/lib/api/prompts.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

### Step 4: Test

```bash
# Test health endpoint
curl https://qdrant-backend-xxxx.onrender.com/api/health

# Test search
curl -X POST https://qdrant-backend-xxxx.onrender.com/api/prompts/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test", "limit": 5}'
```

## 🎉 Done!

Your backend is now live and ready to use!

### Next Steps:
1. Deploy frontend to Vercel/Netlify
2. Update ALLOWED_ORIGINS with your frontend URL
3. Test end-to-end functionality

### Need Help?
- Full guide: [qdrant-backend/RENDER_DEPLOYMENT.md](./qdrant-backend/RENDER_DEPLOYMENT.md)
- Render docs: [https://render.com/docs](https://render.com/docs)
