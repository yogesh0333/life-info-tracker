# 🔧 Add MongoDB URI to Railway

## Your MongoDB Connection String

```
mongodb://mongo:mgupxSpIosqwKyhtDDYBQOiUlHZjbSBA@switchyard.proxy.rlwy.net:41483/life_info_tracker
```

**Note**: I added `/life_info_tracker` at the end for the database name.

---

## Steps to Add to Railway

### 1. Go to Railway Dashboard
- Open: https://railway.app
- Select your **life-info-tracker** project

### 2. Open Backend Service
- Click on your **backend service** (not MongoDB service)

### 3. Add Environment Variable
- Click **"Variables"** tab
- Click **"+ New Variable"** or **"Add Variable"**
- **Name**: `MONGODB_URI`
- **Value**: 
  ```
  mongodb://mongo:mgupxSpIosqwKyhtDDYBQOiUlHZjbSBA@switchyard.proxy.rlwy.net:41483/life_info_tracker
  ```
- Click **"Add"** or **"Save"**

### 4. Redeploy Backend
- Go to **"Deployments"** tab
- Click **"Redeploy"** button
- Wait for deployment to complete

### 5. Check Logs
After redeploy, check logs. You should see:
```
✅ MongoDB Connected: switchyard.proxy.rlwy.net
🚀 Server running on port 8080
```

---

## Verify It's Working

1. Try registering a user again
2. The timeout error should be gone
3. Registration should complete successfully

---

**After adding MONGODB_URI and redeploying, your app will work!**

