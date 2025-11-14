# 🔧 MongoDB Connection Fix

## Error: `Operation users.findOne() buffering timed out after 10000ms`

This means your backend can't connect to MongoDB. Here's how to fix it:

---

## Step 1: Add MongoDB to Railway

1. **Go to Railway dashboard**: https://railway.app
2. **Open your project**: `life-info-tracker`
3. **Click "+ New"** button
4. **Select "Database"** → **"MongoDB"**
5. Railway will create a MongoDB instance automatically

---

## Step 2: Get MongoDB Connection String

1. **Click on the MongoDB service** (the one you just created)
2. **Go to "Variables" tab**
3. **Find "MONGO_URL"** or **"MONGODB_URI"**
4. **Copy the connection string**

It should look like:
```
mongodb://mongo:password@host:port/database
```
or
```
mongodb+srv://user:password@cluster.mongodb.net/database
```

---

## Step 3: Set Environment Variable in Backend Service

1. **Go back to your backend service** (not MongoDB service)
2. **Click "Variables" tab**
3. **Add new variable**:
   - **Name**: `MONGODB_URI`
   - **Value**: Paste the MongoDB connection string you copied
4. **Click "Add"** or **"Save"**

---

## Step 4: Verify Connection String Format

Make sure the connection string includes the database name:

**Correct:**
```
mongodb://mongo:password@host:port/life_info_tracker
```

**Wrong:**
```
mongodb://mongo:password@host:port
```

If it doesn't have a database name, add `/life_info_tracker` at the end.

---

## Step 5: Redeploy Backend

1. **Go to backend service**
2. **Deployments tab**
3. **Click "Redeploy"**
4. **Wait for deployment**

---

## Step 6: Check Logs

After redeploy, check the logs. You should see:

✅ **Success:**
```
✅ MongoDB Connected: hostname
🚀 Server running on port 8080
```

❌ **If still failing:**
- Check MongoDB service is running
- Verify MONGODB_URI is set correctly
- Check connection string format
- Make sure database name is included

---

## Alternative: Use MongoDB Atlas (If Railway MongoDB doesn't work)

1. **Go to**: https://www.mongodb.com/cloud/atlas
2. **Create free cluster**
3. **Get connection string**
4. **Add to Railway backend service** as `MONGODB_URI`
5. **Whitelist Railway IP** (or use 0.0.0.0/0 for testing)

---

## Quick Checklist

- [ ] MongoDB service added to Railway
- [ ] MONGO_URL copied from MongoDB service
- [ ] MONGODB_URI set in backend service variables
- [ ] Connection string includes database name
- [ ] Backend service redeployed
- [ ] Logs show "MongoDB Connected"

---

**Follow these steps and your MongoDB connection will work!**

