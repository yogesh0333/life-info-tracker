# 🚀 Deploy life-info-tracker (NEW SEPARATE PROJECT)

## ⚠️ IMPORTANT: This is a NEW Project!

**This is NOT the same as `YOGESH_LIFE_BLUEPRINT`!**

- **Project Name**: `life-info-tracker`
- **GitHub Repo**: `yogesh0333/life-info-tracker`
- **Purpose**: Multi-user life tracking application
- **Status**: NEW separate project

---

## 📦 Step 1: Deploy Backend to Railway (NEW PROJECT)

**Go to**: https://railway.app

1. **Login** with GitHub
2. **Click "New Project"** (Create a NEW project!)
3. **Select "Deploy from GitHub repo"**
4. **Choose Repository**: `yogesh0333/life-info-tracker` ⚠️ NOT yogesh-life-blueprint!
5. **Project Name**: `life-info-tracker` (or any name you prefer)

6. **Configure Backend Service**:
   - Click on the service that was created
   - Go to **Settings** tab
   - Set **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

7. **Add MongoDB Database** (NEW database for this project):
   - In the Railway project, click **"+ New"**
   - Select **"Database"** → **"MongoDB"**
   - Railway will create a NEW MongoDB instance
   - Click on the MongoDB service
   - Go to **Variables** tab
   - Copy the **MONGO_URL** value

8. **Set Environment Variables** (in the backend service):
   - Go to backend service → **Variables** tab
   - Add these variables:
     ```
     PORT=5000
     NODE_ENV=production
     MONGODB_URI=<paste MONGO_URL from MongoDB service>
     JWT_SECRET=<generate random string: openssl rand -base64 32>
     OPENAI_API_KEY=<your OpenAI API key>
     CLAUDE_API_KEY=<your Claude API key>
     FRONTEND_URL=<will add after Netlify deployment>
     ```

9. **Get Backend URL**:
   - Go to backend service → **Settings** → **Networking**
   - Click **"Generate Domain"**
   - Copy the URL (e.g., `https://life-info-tracker-production.up.railway.app`)
   - **SAVE THIS URL!**

---

## 🌐 Step 2: Deploy Frontend to Netlify (NEW SITE)

**Go to**: https://app.netlify.com

1. **Login** with GitHub
2. **Click "Add new site"** → **"Import an existing project"**
3. **Select Repository**: `yogesh0333/life-info-tracker` ⚠️ NOT yogesh-life-blueprint!
4. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: (leave empty - static files)
   - **Publish directory**: `frontend`
5. **Click "Deploy site"**
6. **Wait 1-2 minutes** for deployment
7. **Get Netlify URL** (e.g., `https://life-info-tracker.netlify.app`)
   - **SAVE THIS URL!**

---

## 🔗 Step 3: Connect Frontend to Backend

1. **Update Frontend Config**:
   - In your local repo, edit `frontend/config.js`
   - Change:
     ```javascript
     const API_URL = 'https://your-railway-backend-url.up.railway.app/api';
     ```
   - Replace with your actual Railway backend URL

2. **Update Railway Environment Variable**:
   - Go back to Railway backend service
   - Update `FRONTEND_URL` variable with your Netlify URL

3. **Push Changes**:
   ```bash
   cd /Users/yogeshyadav/Downloads/car/life-info-tracker
   git add frontend/config.js
   git commit -m "Update API URL for production"
   git push origin main
   ```
   - Netlify will auto-redeploy

---

## ✅ Verification

After deployment:

1. Visit your Netlify URL
2. Click "Create Your Blueprint"
3. Register a new user with DOB
4. Should see personalized dashboard with astrological data
5. All pages should load user-specific content

---

## 🔗 Your URLs (After Deployment)

- **Frontend**: `https://life-info-tracker.netlify.app` (or your custom domain)
- **Backend API**: `https://life-info-tracker-production.up.railway.app/api`
- **GitHub Repo**: `https://github.com/yogesh0333/life-info-tracker`

---

## ⚠️ REMEMBER

- This is a **NEW project** separate from `YOGESH_LIFE_BLUEPRINT`
- Use repository: `yogesh0333/life-info-tracker`
- Create NEW Railway project
- Create NEW Netlify site
- Use NEW MongoDB database

**DO NOT mix with YOGESH_LIFE_BLUEPRINT deployment!**

---

**Ready to deploy! Follow the steps above. 🚀**

