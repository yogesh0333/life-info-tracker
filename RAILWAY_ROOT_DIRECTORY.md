# 🔧 How to Set Root Directory in Railway

## ⚠️ CRITICAL: You MUST Set Root Directory!

Railway shows "No providers" because it can't find your `package.json`. You need to tell Railway where your Node.js app is located.

## Step-by-Step Instructions

### 1. Find Root Directory Setting

The Root Directory setting is usually in one of these places:

**Option A: In the Settings Tab**
1. Go to your Railway project
2. Click on the backend service
3. Go to **Settings** tab
4. Scroll down - look for **"Root Directory"** or **"Working Directory"**
5. It might be near the top or bottom of the settings page

**Option B: In the Deploy Tab**
1. Go to your Railway project
2. Click on the backend service
3. Look for **"Deploy"** or **"Build"** section
4. Find **"Root Directory"** field

**Option C: In Service Settings**
1. Click on the service name/icon
2. Look for **"Settings"** or **"Configuration"**
3. Find **"Root Directory"** field

### 2. Set Root Directory

1. Find the **"Root Directory"** field (it might be empty or show `/`)
2. **Type**: `backend` (just the word "backend", no slash, no quotes)
3. Click **Save** or **Update**

### 3. Verify

After setting Root Directory:
- Railway will automatically redeploy
- Check the logs - you should see:
  - `Detected Node.js`
  - `npm install` running
  - `npm start` executing
  - `Server running on port...`

## If You Can't Find Root Directory

If you can't find the Root Directory setting:

1. **Try deleting and recreating the service:**
   - Delete the current service
   - Add new service → Deploy from GitHub
   - Select `yogesh0333/life-info-tracker`
   - **IMMEDIATELY** go to Settings and set Root Directory to `backend`
   - Before Railway tries to build

2. **Or use Railway CLI:**
   ```bash
   railway link
   railway variables set RAILWAY_ROOT_DIRECTORY=backend
   ```

## What Should Happen

Once Root Directory is set to `backend`:
- ✅ Railway detects Node.js (from `backend/package.json`)
- ✅ "No providers" changes to "Node.js"
- ✅ Build command works: `npm install`
- ✅ Start command works: `npm start`
- ✅ Server starts successfully

## Still Having Issues?

Make sure:
- ✅ Root Directory is set to exactly: `backend` (lowercase, no slash)
- ✅ `backend/package.json` exists in your repo
- ✅ `backend/server.js` exists
- ✅ You've saved the settings

---

**The Root Directory setting is the key to making Railway detect your Node.js app!**

