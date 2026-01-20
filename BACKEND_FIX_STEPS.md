# Backend Fix & Deployment Steps

## ✅ Changes Made (Just Now)

1. **Fixed API URL** - Added `/api` to the production URL
2. **Fixed CORS** - Now allows all origins (backend will accept requests from anywhere)
3. **Fixed Database Path** - Uses `/tmp` folder on Render (the only writable location)
4. **Fixed Uploads Directory** - Uses `/tmp/uploads` on production

---

## 🚀 What You Need to Do Now

### Step 1: Push Changes to GitHub

```bash
cd d:\projects\karigar\labor-management-app
git add .
git commit -m "Fix: Backend configuration for Render deployment"
git push origin main
```

### Step 2: Redeploy on Render

**Option A: Automatic (if connected to GitHub)**
- Render will automatically detect the changes and redeploy
- Go to https://dashboard.render.com
- Check your service - it should say "Deploying..."
- Wait 2-5 minutes

**Option B: Manual Deploy**
1. Go to https://dashboard.render.com
2. Click on your backend service
3. Click "Manual Deploy" → "Deploy latest commit"
4. Wait for deployment to complete

### Step 3: Verify Backend is Working

After deployment completes, test your backend:

**Method 1: Browser Test**
Open this URL in your browser:
```
https://labor-management-app.onrender.com/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-01-20T..."
}
```

**Method 2: Check Workers API**
```
https://labor-management-app.onrender.com/api/workers
```

Should return:
```json
{
  "workers": []
}
```

### Step 4: Rebuild Frontend

Since we changed `.env.production`, you need to rebuild:

```bash
cd d:\projects\karigar\labor-management-app\client
npm run build
```

Then deploy the updated build folder to Netlify.

---

## 🔧 Important Notes

### ⚠️ Database Warning
On Render's free tier:
- Database is stored in `/tmp` (temporary storage)
- **Data will be lost when the service restarts** (every 24-48 hours or on redeploy)
- For permanent storage, you need to upgrade to a paid plan or use an external database

### 📱 Solutions for Data Persistence

**Option 1: Use External Database (Recommended)**
- PostgreSQL on Render (free tier available)
- MongoDB Atlas (free tier available)
- Supabase (free tier available)

**Option 2: Upgrade Render**
- Paid plan starts at $7/month
- Includes persistent disk storage

**Option 3: Use Netlify Functions + Better Backend Host**
- Railway.app (free $5/month credit)
- Fly.io (free tier with persistent storage)

---

## 🐛 Troubleshooting

### If backend still doesn't work:

1. **Check Render Logs**
   - Go to Render dashboard
   - Click your service
   - Click "Logs" tab
   - Look for errors

2. **Common Issues:**

   **"Cannot write to database"**
   - Solution: Make sure `NODE_ENV=production` is set in Render environment variables

   **"CORS error"**
   - Solution: Already fixed in the code!

   **"502 Bad Gateway"**
   - Backend is still starting up (wait 1-2 minutes)
   - Or backend crashed (check logs)

3. **Environment Variables to Set on Render:**
   - `NODE_ENV` = `production`

---

## 📞 Need Help?

If you're still facing issues after following these steps:
1. Share the Render logs (from the Logs tab)
2. Share the exact error message from the browser console
3. Share your actual Render backend URL

---

## ✨ After Everything Works

Once your backend is working:
1. Test adding a worker from the frontend
2. Test all features (attendance, reports, etc.)
3. Consider upgrading to a database solution for data persistence
