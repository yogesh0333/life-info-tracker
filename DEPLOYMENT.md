# Deployment Guide - Life Info Tracker

## 🚀 Deployment Steps

### Frontend Deployment (Netlify)

#### Option 1: Deploy via Netlify Dashboard

1. **Go to Netlify**: https://app.netlify.com
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub**:
   - Select your repository: `life-info-tracker`
   - Base directory: `frontend`
   - Build command: (leave empty - static files)
   - Publish directory: `frontend`
4. **Click "Deploy site"**

#### Option 2: Deploy via Netlify CLI

```bash
cd frontend
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

#### After Deployment:

1. **Get your Netlify URL** (e.g., `https://your-site.netlify.app`)
2. **Update `frontend/config.js`**:
   ```javascript
   const API_URL = 'https://your-backend-url.railway.app/api';
   ```
3. **Redeploy** (or push to GitHub for auto-deploy)

---

### Backend Deployment (Railway)

#### Step 1: Prepare Railway

1. **Go to Railway**: https://railway.app
2. **Sign up/Login** with GitHub
3. **Click "New Project"**

#### Step 2: Deploy Backend

1. **Select "Deploy from GitHub repo"**
2. **Choose your repository**: `life-info-tracker`
3. **Select root directory**: `backend`
4. **Railway will auto-detect Node.js**

#### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret_key
OPENAI_API_KEY=your_openai_key
CLAUDE_API_KEY=your_claude_key
FRONTEND_URL=https://your-netlify-site.netlify.app
```

#### Step 4: Get Backend URL

1. **Go to Settings → Networking**
2. **Click "Generate Domain"**
3. **Copy the URL** (e.g., `https://life-info-tracker-production.up.railway.app`)

#### Step 5: Update Frontend Config

1. **Update `frontend/config.js`**:
   ```javascript
   const API_URL = 'https://your-railway-url.up.railway.app/api';
   ```
2. **Commit and push** to trigger Netlify redeploy

---

## 🔧 MongoDB Setup

### Option A: Railway MongoDB (Recommended)

1. **In Railway project**, click **"+ New"**
2. **Select "Database" → "MongoDB"**
3. **Railway creates MongoDB automatically**
4. **Copy connection string** from MongoDB service
5. **Add to environment variables** as `MONGODB_URI`

### Option B: MongoDB Atlas

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Create free cluster**
3. **Get connection string**
4. **Add to Railway environment variables**

---

## ✅ Post-Deployment Checklist

- [ ] Backend deployed on Railway
- [ ] Frontend deployed on Netlify
- [ ] MongoDB connected
- [ ] Environment variables set
- [ ] Frontend `config.js` updated with backend URL
- [ ] Test registration flow
- [ ] Test login flow
- [ ] Test dashboard loading

---

## 🔗 URLs After Deployment

- **Frontend**: `https://your-site.netlify.app`
- **Backend API**: `https://your-backend.railway.app/api`
- **Health Check**: `https://your-backend.railway.app/`

---

## 🐛 Troubleshooting

### Backend Issues:
- Check Railway logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set
- Check port configuration (Railway auto-assigns PORT)

### Frontend Issues:
- Check Netlify deploy logs
- Verify `config.js` has correct backend URL
- Check browser console for API errors
- Ensure CORS is configured in backend

### CORS Issues:
- Update `backend/server.js` CORS origin to your Netlify URL
- Redeploy backend

---

## 📝 Quick Deploy Commands

```bash
# Backend (Railway auto-deploys from GitHub)
git add .
git commit -m "Ready for deployment"
git push origin main

# Frontend (Netlify auto-deploys from GitHub)
# Just push to GitHub, Netlify will auto-deploy
```

---

**Ready to deploy! Follow the steps above.**

