# 🚀 Quick Deployment Guide

## Step 1: Push to GitHub

```bash
cd /Users/yogeshyadav/Downloads/car/life-info-tracker

# Create repo on GitHub first:
# Go to: https://github.com/new
# Name: life-info-tracker
# Create repository

# Then push:
git remote add origin https://github.com/yogesh0333/life-info-tracker.git
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

1. **Go to**: https://railway.app
2. **Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `yogesh0333/life-info-tracker`
6. **Settings**:
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

7. **Add MongoDB**:
   - Click "+ New" → "Database" → "MongoDB"
   - Copy connection string

8. **Set Environment Variables**:
   - Go to Variables tab
   - Add these:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=<paste from MongoDB service>
     JWT_SECRET=<generate strong random string>
     OPENAI_API_KEY=<your key>
     CLAUDE_API_KEY=<your key>
     FRONTEND_URL=<will add after Netlify deploy>
     ```

9. **Get Backend URL**:
   - Settings → Networking → Generate Domain
   - Copy URL (e.g., `https://life-info-tracker-production.up.railway.app`)

---

## Step 3: Deploy Frontend to Netlify

1. **Go to**: https://app.netlify.com
2. **Login** with GitHub
3. **Click "Add new site" → "Import an existing project"**
4. **Select**: `yogesh0333/life-info-tracker`
5. **Configure**:
   - Base directory: `frontend`
   - Build command: (leave empty)
   - Publish directory: `frontend`
6. **Click "Deploy site"**
7. **Get Netlify URL** (e.g., `https://life-info-tracker.netlify.app`)

---

## Step 4: Connect Frontend to Backend

1. **Update `frontend/config.js`**:
   ```javascript
   const API_URL = 'https://your-railway-url.up.railway.app/api';
   ```

2. **Update Railway Environment Variable**:
   - Go back to Railway
   - Add/Update: `FRONTEND_URL=https://your-netlify-url.netlify.app`

3. **Update Backend CORS** (if needed):
   - In `backend/server.js`, update CORS origin to your Netlify URL

4. **Redeploy**:
   - Push changes to GitHub
   - Both will auto-deploy

---

## ✅ Test Deployment

1. Visit your Netlify URL
2. Click "Create Your Blueprint"
3. Register with DOB
4. Should redirect to dashboard
5. Check if data loads correctly

---

## 🔗 Your URLs

- **Frontend**: `https://life-info-tracker.netlify.app` (or your custom domain)
- **Backend**: `https://life-info-tracker-production.up.railway.app`
- **API**: `https://life-info-tracker-production.up.railway.app/api`

---

**That's it! Your app is live! 🎉**

