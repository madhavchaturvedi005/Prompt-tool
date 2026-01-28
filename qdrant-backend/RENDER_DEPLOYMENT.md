# Deploying Qdrant Backend to Render

This guide will help you deploy the Qdrant backend server to Render.

## Prerequisites

- A [Render account](https://render.com) (free tier available)
- Your GitHub repository pushed with the qdrant-backend folder
- Qdrant Cloud instance URL and API key
- OpenAI API key

## Deployment Steps

### Option 1: Deploy via Render Dashboard (Recommended)

1. **Go to Render Dashboard**
   - Visit [https://dashboard.render.com](https://dashboard.render.com)
   - Sign in or create a free account

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect Your Repository**
   - Choose "Connect a repository"
   - Authorize Render to access your GitHub account
   - Select your repository: `madhavchaturvedi005/Prompt-tool`

4. **Configure the Service**
   ```
   Name: qdrant-backend
   Region: Oregon (US West) or closest to you
   Branch: main
   Root Directory: qdrant-backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

5. **Add Environment Variables**
   Click "Advanced" and add these environment variables:
   
   ```
   NODE_ENV = production
   PORT = 3001
   QDRANT_URL = https://your-qdrant-instance.qdrant.io
   QDRANT_API_KEY = your_qdrant_api_key
   OPENAI_API_KEY = your_openai_api_key
   ALLOWED_ORIGINS = https://your-frontend-url.com,http://localhost:5173
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Render will automatically build and deploy your service
   - Wait for the deployment to complete (usually 2-5 minutes)

7. **Get Your Backend URL**
   - Once deployed, you'll get a URL like: `https://qdrant-backend-xxxx.onrender.com`
   - Copy this URL for your frontend configuration

### Option 2: Deploy via Blueprint (render.yaml)

1. **Update render.yaml**
   - The `render.yaml` file is already in your `qdrant-backend` folder
   - Update the `ALLOWED_ORIGINS` value with your frontend URL

2. **Deploy from Dashboard**
   - Go to Render Dashboard
   - Click "New +" → "Blueprint"
   - Connect your repository
   - Select the repository and branch
   - Render will detect the `render.yaml` file
   - Add the secret environment variables (QDRANT_URL, QDRANT_API_KEY, OPENAI_API_KEY)
   - Click "Apply"

### Option 3: Deploy via Render CLI

1. **Install Render CLI**
   ```bash
   npm install -g @render/cli
   ```

2. **Login to Render**
   ```bash
   render login
   ```

3. **Deploy**
   ```bash
   cd qdrant-backend
   render deploy
   ```

## Post-Deployment Configuration

### 1. Update Frontend Environment Variables

Update your frontend `.env` file with the Render backend URL:

```env
VITE_BACKEND_URL=https://qdrant-backend-xxxx.onrender.com
```

### 2. Update API Endpoints

In your frontend code (`src/lib/api/prompts.ts`), update the base URL:

```typescript
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
```

### 3. Configure CORS

Make sure your frontend URL is in the `ALLOWED_ORIGINS` environment variable on Render.

## Testing Your Deployment

### 1. Health Check

Test if your backend is running:

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

### 2. Test Search Endpoint

```bash
curl -X POST https://qdrant-backend-xxxx.onrender.com/api/prompts/search \
  -H "Content-Type: application/json" \
  -d '{"query": "code review", "limit": 5}'
```

## Monitoring and Logs

### View Logs
1. Go to your service in Render Dashboard
2. Click on "Logs" tab
3. View real-time logs and errors

### Monitor Performance
1. Check the "Metrics" tab for:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

## Troubleshooting

### Service Won't Start

**Problem**: Service fails to start or crashes

**Solutions**:
1. Check logs for error messages
2. Verify all environment variables are set correctly
3. Ensure `package.json` has correct start script
4. Check Node.js version compatibility

### CORS Errors

**Problem**: Frontend can't connect to backend

**Solutions**:
1. Add your frontend URL to `ALLOWED_ORIGINS`
2. Include both production and development URLs
3. Format: `https://app.com,http://localhost:5173`

### Qdrant Connection Errors

**Problem**: Can't connect to Qdrant

**Solutions**:
1. Verify `QDRANT_URL` is correct
2. Check `QDRANT_API_KEY` is valid
3. Ensure Qdrant instance is running
4. Test connection from Render logs

### OpenAI API Errors

**Problem**: Embedding generation fails

**Solutions**:
1. Verify `OPENAI_API_KEY` is correct
2. Check OpenAI account has credits
3. Ensure API key has proper permissions

## Free Tier Limitations

Render's free tier includes:
- ✅ 750 hours/month of runtime
- ✅ Automatic HTTPS
- ✅ Automatic deploys from Git
- ⚠️ Services spin down after 15 minutes of inactivity
- ⚠️ Cold starts take 30-60 seconds

### Handling Cold Starts

To minimize cold start impact:

1. **Add Loading States** in your frontend
2. **Implement Retry Logic** for failed requests
3. **Use Keep-Alive Service** (optional paid service)
4. **Upgrade to Paid Plan** for always-on service

## Updating Your Deployment

### Automatic Deploys

Render automatically deploys when you push to your main branch:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

### Manual Deploy

1. Go to Render Dashboard
2. Select your service
3. Click "Manual Deploy" → "Deploy latest commit"

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | Set to `production` |
| `PORT` | Yes | Port number (default: 3001) |
| `QDRANT_URL` | Yes | Your Qdrant instance URL |
| `QDRANT_API_KEY` | Yes | Qdrant API key |
| `OPENAI_API_KEY` | Yes | OpenAI API key for embeddings |
| `ALLOWED_ORIGINS` | Yes | Comma-separated list of allowed origins |

## Security Best Practices

1. **Never commit API keys** to your repository
2. **Use environment variables** for all secrets
3. **Rotate API keys** regularly
4. **Monitor usage** to detect anomalies
5. **Set up alerts** for errors and high usage

## Cost Optimization

### Free Tier Tips
- Use free tier for development and testing
- Monitor usage to stay within limits
- Optimize API calls to reduce costs

### Upgrade Considerations
- Upgrade to paid plan ($7/month) for:
  - Always-on service (no cold starts)
  - More compute resources
  - Better performance
  - Priority support

## Support

- **Render Documentation**: [https://render.com/docs](https://render.com/docs)
- **Render Community**: [https://community.render.com](https://community.render.com)
- **Project Issues**: Open an issue on GitHub

## Next Steps

After deploying your backend:

1. ✅ Test all API endpoints
2. ✅ Update frontend configuration
3. ✅ Deploy frontend to Vercel/Netlify
4. ✅ Test end-to-end functionality
5. ✅ Set up monitoring and alerts
6. ✅ Configure custom domain (optional)

---

**Deployment URL**: `https://qdrant-backend-xxxx.onrender.com`

Remember to replace `xxxx` with your actual Render service ID!
