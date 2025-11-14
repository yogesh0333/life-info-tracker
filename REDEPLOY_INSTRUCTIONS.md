# 🔄 How to Redeploy on Railway

## Automatic Redeploy

Railway automatically redeploys when you push to GitHub. Since we just pushed changes, Railway should be redeploying now.

**Check your Railway dashboard** - you should see a new deployment in progress.

---

## Manual Redeploy (If Needed)

If Railway didn't auto-redeploy, you can trigger it manually:

### Option 1: Via Railway Dashboard

1. Go to https://railway.app
2. Click on your **life-info-tracker** project
3. Click on the **backend service**
4. Go to **"Deployments"** tab
5. Click **"Redeploy"** or **"Deploy"** button
6. Wait for deployment to complete

### Option 2: Via Railway CLI

```bash
railway redeploy
```

### Option 3: Trigger via Git (Force Push)

```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## What to Expect

After redeploy, check the logs:

✅ **Success indicators:**
- `Using Railpack` (not Nixpacks)
- `Detected Node.js`
- `npm install` running
- `npm start` executing
- `Server running on port...`
- `MongoDB connected` (if configured)

❌ **If you see errors:**
- Check that Root Directory is set to `backend`
- Verify environment variables are set
- Check MongoDB connection string

---

## Current Configuration

- **Builder**: RAILPACK (recommended)
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Root Directory**: Should be set to `backend` in Railway settings

---

**Railway should be redeploying automatically now! Check your dashboard.**

