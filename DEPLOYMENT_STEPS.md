# 🚀 Complete Deployment Steps for Promptea.dev

## Current Status
✅ Code pushed to GitHub: `https://github.com/madhavchaturvedi005/Prompt-tool.git`
✅ Domain configured: `promptea.dev` and `www.promptea.dev`
✅ Backend configuration ready for Render
✅ Frontend configured to use environment variable for backend URL

## 🎯 Next Steps to Complete Deployment

### Step 1: Deploy Backend to Render (5 minutes)

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Sign in or create account

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect GitHub: `madhavchaturvedi005/Prompt-tool`
   - Configure:
     ```
     Name: qdrant-backend
     Root Directory: qdrant-backend
     Build Command: npm install
     Start Command: npm start
     Plan: Free
     ```

3. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   QDRANT_URL=https://8b745f0a-0926-468e-8989-e40430834d4f.us-east4-0.gcp.cloud.qdrant.io
   QDRANT_API_KEY=[your-qdrant-api-key]
   OPENAI_API_KEY=[your-openai-api-key]
   ALLOWED_ORIGINS=https://promptea.dev,https://www.promptea.dev,http://localhost:5173
   ```

4. **Deploy & Get URL**
   - Click "Create Web Service"
   - Wait 2-5 minutes
   - Copy your backend URL: `https://qdrant-backend-xxxx.onrender.com`

### Step 2: Configure Frontend Environment Variable

You need to add the backend URL to your frontend deployment platform.

#### Option A: Vercel (Recommended)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Add Environment Variable**
   - Go to Vercel project settings
   - Navigate to "Environment Variables"
   - Add:
     - Name: `VITE_BACKEND_URL`
     - Value: `https://qdrant-backend-xxxx.onrender.com` (your Render URL)
   - Redeploy

3. **Configure Domain**
   - Go to Domains section
   - Add `promptea.dev`
   - Update DNS as instructed

#### Option B: Netlify

1. **Deploy to Netlify**
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

2. **Add Environment Variable**
   - Go to Site settings → Environment
   - Add:
     - Key: `VITE_BACKEND_URL`
     - Value: `https://qdrant-backend-xxxx.onrender.com`
   - Trigger new deploy

3. **Configure Domain**
   - Go to Domain settings
   - Add `promptea.dev`
   - Update DNS

### Step 3: Verify Deployment

1. **Test Backend**
   ```bash
   curl https://qdrant-backend-xxxx.onrender.com/api/health
   ```

2. **Test Frontend**
   - Visit: https://www.promptea.dev
   - Open browser console (F12)
   - Navigate to Library page
   - Check for successful API calls (no CORS errors)

## 📋 Environment Variables Checklist

### Backend (Render) ✅
- [x] NODE_ENV=production
- [x] PORT=3001
- [ ] QDRANT_URL (add your Qdrant URL)
- [ ] QDRANT_API_KEY (add your key)
- [ ] OPENAI_API_KEY (add your key)
- [x] ALLOWED_ORIGINS (already configured)

### Frontend (Vercel/Netlify) ⚠️
- [ ] VITE_BACKEND_URL (add after deploying backend)
- [ ] VITE_SUPABASE_URL (if using Supabase)
- [ ] VITE_SUPABASE_ANON_KEY (if using Supabase)

## 🔧 Troubleshooting

### CORS Errors
**Problem:** Still getting CORS errors after deployment

**Solution:**
1. Verify `VITE_BACKEND_URL` is set in frontend deployment
2. Verify `ALLOWED_ORIGINS` includes your domain in backend
3. Redeploy both frontend and backend
4. Clear browser cache

### Backend Not Responding
**Problem:** Backend returns 503 or times out

**Solution:**
1. Free tier services sleep after 15 minutes
2. First request takes 30-60 seconds to wake up
3. This is normal for Render free tier
4. Consider upgrading to paid plan ($7/month) for always-on

### Environment Variable Not Working
**Problem:** Frontend still connecting to localhost

**Solution:**
1. Ensure variable name is `VITE_BACKEND_URL` (must start with VITE_)
2. Redeploy frontend after adding variable
3. Check build logs to confirm variable is set
4. Clear browser cache and hard refresh (Ctrl+Shift+R)

## 📚 Documentation

- **Backend Deployment**: See `qdrant-backend/RENDER_DEPLOYMENT.md`
- **Frontend Deployment**: See `FRONTEND_DEPLOYMENT.md`
- **Quick Start**: See `DEPLOYMENT_QUICKSTART.md`

## 🎉 Post-Deployment

After successful deployment:

1. ✅ Test all features on production
2. ✅ Monitor backend logs in Render dashboard
3. ✅ Set up error tracking (optional)
4. ✅ Configure custom domain SSL (automatic on Vercel/Netlify)
5. ✅ Share your live site: https://www.promptea.dev

## 💡 Important Notes

1. **Render Free Tier**: Services sleep after 15 minutes of inactivity
2. **Cold Starts**: First request after sleep takes 30-60 seconds
3. **Environment Variables**: Must start with `VITE_` for Vite to expose them
4. **CORS**: Both domains (with and without www) are configured
5. **Redeployment**: Changes to environment variables require redeployment

## 🆘 Need Help?

- Check the detailed guides in the repository
- Review Render logs for backend errors
- Check browser console for frontend errors
- Verify all environment variables are set correctly

---

**Your Backend URL (after deployment):** `https://qdrant-backend-xxxx.onrender.com`
**Your Frontend URL:** `https://www.promptea.dev`

Replace `xxxx` with your actual Render service ID!
