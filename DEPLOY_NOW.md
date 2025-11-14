# 🚀 Deploy Now - Step by Step

## ⚡ Quick Steps

### 1️⃣ Create GitHub Repository

**Option A: Via GitHub Website**
1. Go to: https://github.com/new
2. Repository name: `life-info-tracker`
3. Description: "Multi-user life tracking application with AI and astrological alignment"
4. Make it **Public** or **Private** (your choice)
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

**Option B: Via GitHub CLI** (if installed)
```bash
gh repo create life-info-tracker --public --source=. --remote=origin --push
```

---

### 2️⃣ Push Code to GitHub

```bash
cd /Users/yogeshyadav/Downloads/car/life-info-tracker
git remote add origin https://github.com/yogesh0333/life-info-tracker.git
git push -u origin main
```

---

### 3️⃣ Deploy Backend to Railway

1. **Go to**: https://railway.app
2. **Login** with GitHub
3. **Click "New Project"**
4. **Select "Deploy from GitHub repo"**
5. **Choose**: `yogesh0333/life-info-tracker`
6. **Configure Service**:
   - Click on the service
   - Go to **Settings** tab
   - Set **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

7. **Add MongoDB Database**:
   - In Railway project, click **"+ New"**
   - Select **"Database" → "MongoDB"**
   - Railway will create MongoDB automatically
   - Click on MongoDB service
   - Go to **Variables** tab
   - Copy the **MONGO_URL** value

8. **Set Environment Variables**:
   - Go back to your backend service
   - Click **Variables** tab
   - Add these variables:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=<paste MONGO_URL from MongoDB service>
     JWT_SECRET=<generate random string, e.g., use: openssl rand -base64 32>
     OPENAI_API_KEY=<your OpenAI key>
     CLAUDE_API_KEY=<your Claude key>
     FRONTEND_URL=<will add after Netlify>
     ```

9. **Get Backend URL**:
   - Go to **Settings → Networking**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://life-info-tracker-production.up.railway.app`)
   - **Save this URL!**

---

### 4️⃣ Deploy Frontend to Netlify

1. **Go to**: https://app.netlify.com
2. **Login** with GitHub
3. **Click "Add new site" → "Import an existing project"**
4. **Select**: `yogesh0333/life-info-tracker`
5. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: (leave empty - static files)
   - **Publish directory**: `frontend`
6. **Click "Deploy site"**
7. **Wait for deployment** (takes 1-2 minutes)
8. **Get Netlify URL** (e.g., `https://life-info-tracker.netlify.app`)
   - **Save this URL!**

---

### 5️⃣ Connect Frontend to Backend

1. **Update Frontend Config**:
   - In your local repo, edit `frontend/config.js`
   - Change:
     ```javascript
     const API_URL = 'https://your-railway-url.up.railway.app/api';
     ```
   - Replace with your actual Railway URL

2. **Update Railway CORS**:
   - Go back to Railway
   - Update `FRONTEND_URL` variable with your Netlify URL
   - Or update `backend/server.js` CORS origin

3. **Push Changes**:
   ```bash
   git add frontend/config.js
   git commit -m "Update API URL for production"
   git push origin main
   ```
   - Netlify will auto-redeploy

---

## ✅ Verify Deployment

1. **Visit your Netlify URL**
2. **Click "Create Your Blueprint"**
3. **Register** with:
   - Name: Test User
   - Email: test@example.com
   - DOB: 1990-01-15
   - Password: Test123!
4. **Should redirect to dashboard**
5. **Check if astrological data loads**

---

## 🔗 Your Live URLs

After deployment, you'll have:

- **Frontend**: `https://life-info-tracker.netlify.app`
- **Backend API**: `https://life-info-tracker-production.up.railway.app/api`
- **Health Check**: `https://life-info-tracker-production.up.railway.app/`

---

## 🐛 Troubleshooting

### Backend not connecting?
- Check Railway logs
- Verify MongoDB URI is correct
- Ensure all environment variables are set

### Frontend can't reach backend?
- Check `config.js` has correct backend URL
- Verify CORS is configured in backend
- Check browser console for errors

### Registration fails?
- Check Railway logs
- Verify MongoDB is running
- Check environment variables

---

## 📝 Commands Summary

```bash
# 1. Create GitHub repo (via website)
# 2. Push code
git remote add origin https://github.com/yogesh0333/life-info-tracker.git
git push -u origin main

# 3. Deploy backend to Railway (via dashboard)
# 4. Deploy frontend to Netlify (via dashboard)
# 5. Update config.js with backend URL
# 6. Push again
git add frontend/config.js
git commit -m "Update API URL"
git push origin main
```

---

**Follow these steps and your app will be live! 🚀**

