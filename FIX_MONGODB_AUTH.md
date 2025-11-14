# 🔧 Fix MongoDB Authentication Error

## Current Error
```
❌ MongoDB Connection Error: Authentication failed.
```

## Solution: Add authSource=admin

Railway MongoDB requires `authSource=admin` in the connection string.

### Update MONGODB_URI in Railway

1. **Go to Railway** → Backend service → **Variables** tab
2. **Find** `MONGODB_URI`
3. **Update the value** to:
   ```
   mongodb://mongo:mgupxSpIosqwKyhtDDYBQOiUlHZjbSBA@switchyard.proxy.rlwy.net:41483/life_info_tracker?authSource=admin
   ```
4. **Save** the variable
5. **Redeploy** backend service

---

## Alternative: Code Auto-Fix (Already Applied)

I've updated the code to automatically add `authSource=admin` for Railway MongoDB connections.

**After redeploying**, the code will automatically append `?authSource=admin` if it detects Railway MongoDB.

---

## Verify Connection

After updating and redeploying, check logs for:
```
✅ MongoDB Connected: switchyard.proxy.rlwy.net
```

If you still see authentication errors, try the manual fix above.

---

**Update MONGODB_URI with `?authSource=admin` and redeploy!**

