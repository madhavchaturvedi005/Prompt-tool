# Frontend Deployment Guide

## Environment Variables Setup

### Required Environment Variable

After deploying your backend to Render, you need to configure your frontend to use the deployed backend URL.

### Step 1: Get Your Backend URL

After deploying to Render, you'll get a URL like:
```
https://qdrant-backend-xxxx.onrender.com
```

### Step 2: Update Frontend Environment Variables

#### For Local Development

Update your `.env` file:
```env
VITE_BACKEND_URL=https://qdrant-backend-xxxx.onrender.com
```

#### For Production (Vercel/Netlify)

Add the environment variable in your deployment platform:

**Vercel:**
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - Name: `VITE_BACKEND_URL`
   - Value: `https://qdrant-backend-xxxx.onrender.com`
4. Redeploy your application

**Netlify:**
1. Go to Site settings → Build & deploy → Environment
2. Add:
   - Key: `VITE_BACKEND_URL`
   - Value: `https://qdrant-backend-xxxx.onrender.com`
3. Trigger a new deploy

### Step 3: Update Backend CORS

Make sure your backend's `ALLOWED_ORIGINS` includes your frontend domain:

In Render dashboard, update the environment variable:
```
ALLOWED_ORIGINS=https://promptea.dev,https://www.promptea.dev,http://localhost:5173
```

### Step 4: Test the Connection

After deployment, test that your frontend can connect to the backend:

1. Open your deployed site: https://www.promptea.dev
2. Open browser console (F12)
3. Navigate to the Library page
4. Check for any CORS or connection errors

If everything is configured correctly, you should see successful API calls to your Render backend.

## Troubleshooting

### CORS Errors

**Problem:** `Access to fetch at 'https://backend.onrender.com' has been blocked by CORS`

**Solution:**
1. Verify `ALLOWED_ORIGINS` in Render includes your frontend URL
2. Make sure to include both `https://promptea.dev` and `https://www.promptea.dev`
3. Redeploy backend after changing environment variables

### Connection Refused

**Problem:** `net::ERR_CONNECTION_REFUSED` or trying to connect to `localhost:3001`

**Solution:**
1. Verify `VITE_BACKEND_URL` is set in your deployment platform
2. Make sure the environment variable starts with `VITE_` (required for Vite)
3. Redeploy frontend after adding the variable

### Backend Not Responding

**Problem:** Backend returns 503 or times out

**Solution:**
1. Check if backend is running in Render dashboard
2. Free tier services sleep after 15 minutes of inactivity
3. First request may take 30-60 seconds to wake up the service
4. Consider upgrading to paid plan for always-on service

## Complete Environment Variables Checklist

### Frontend (.env)
```env
# Backend API
VITE_BACKEND_URL=https://qdrant-backend-xxxx.onrender.com

# Supabase (if using)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# OpenAI (if using client-side)
VITE_OPENAI_API_KEY=your-openai-key
```

### Backend (Render)
```env
NODE_ENV=production
PORT=3001
QDRANT_URL=https://your-qdrant-instance.qdrant.io
QDRANT_API_KEY=your-qdrant-key
OPENAI_API_KEY=your-openai-key
ALLOWED_ORIGINS=https://promptea.dev,https://www.promptea.dev,http://localhost:5173
```

## Deployment Platforms

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to project settings
   - Add `VITE_BACKEND_URL`
   - Redeploy

3. **Custom Domain**
   - Add `promptea.dev` in Domains section
   - Update DNS records as instructed

### Netlify

1. **Connect Repository**
   - Go to Netlify dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add `VITE_BACKEND_URL`

4. **Custom Domain**
   - Go to Domain settings
   - Add custom domain `promptea.dev`
   - Update DNS records

### GitHub Pages

Not recommended for this project as it doesn't support environment variables well and requires additional configuration for SPAs.

## Post-Deployment Checklist

- [ ] Backend deployed to Render
- [ ] Backend URL added to frontend environment variables
- [ ] Frontend domain added to backend CORS
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Custom domain configured
- [ ] SSL certificate active (automatic on Vercel/Netlify)
- [ ] Test all API endpoints from production
- [ ] Monitor backend logs for errors
- [ ] Set up error tracking (Sentry, etc.)

## Monitoring

### Backend Health Check

```bash
curl https://qdrant-backend-xxxx.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Qdrant proxy server is running",
  "qdrantUrl": "https://your-qdrant-instance.qdrant.io",
  "timestamp": "2024-01-28T12:00:00.000Z"
}
```

### Frontend API Test

Open browser console on your deployed site and run:
```javascript
fetch('https://qdrant-backend-xxxx.onrender.com/api/health')
  .then(r => r.json())
  .then(console.log)
```

## Support

- Backend deployment: See `qdrant-backend/RENDER_DEPLOYMENT.md`
- Quick start: See `DEPLOYMENT_QUICKSTART.md`
- Issues: Open a GitHub issue
