# 🔄 Force Redeploy on Railway

## Quick Steps to Redeploy

### Step 1: Go to Railway Dashboard
1. Open: https://railway.app
2. Login to your account
3. Find your **life-info-tracker** project

### Step 2: Access Your Service
1. Click on the **backend service** (the one that's not deploying)
2. You should see the service dashboard

### Step 3: Trigger Redeploy
**Option A: Deployments Tab**
1. Click **"Deployments"** tab (or "Deploys")
2. Find the latest deployment
3. Click **"Redeploy"** button (or three dots menu → Redeploy)

**Option B: Settings Tab**
1. Click **"Settings"** tab
2. Scroll down
3. Look for **"Redeploy"** or **"Deploy"** button
4. Click it

**Option C: Service Menu**
1. Click the three dots (⋯) next to service name
2. Select **"Redeploy"** or **"Deploy Latest"**

### Step 4: Verify Root Directory
**CRITICAL**: Before redeploying, check:
1. Go to **Settings** tab
2. Find **"Root Directory"** field
3. Make sure it's set to: `backend`
4. If not, set it and **Save**
5. Then redeploy

---

## If Redeploy Button Doesn't Work

### Method 1: Delete and Recreate Service
1. Delete the current backend service
2. Click **"+ New"** → **"GitHub Repo"**
3. Select: `yogesh0333/life-info-tracker`
4. **IMMEDIATELY** go to Settings
5. Set Root Directory to: `backend`
6. Save
7. Railway will deploy automatically

### Method 2: Disconnect and Reconnect
1. Go to service Settings
2. Disconnect from GitHub
3. Reconnect to GitHub
4. Select the repo again
5. Set Root Directory to `backend`
6. Save

---

## What to Check in Logs After Redeploy

✅ **Success:**
- `Using Railpack`
- `Detected Node.js`
- `npm install` running
- `npm start` executing
- `Server running on port...`

❌ **If errors:**
- Check Root Directory is `backend`
- Verify environment variables
- Check MongoDB connection

---

**Go to Railway dashboard and manually click the Redeploy button!**

