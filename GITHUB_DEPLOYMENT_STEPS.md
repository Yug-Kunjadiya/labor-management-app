# 🚀 GitHub & Deployment - Step-by-Step Guide

## Part 1: Push to GitHub

### Step 1: Add All Changes
```powershell
cd D:\projects\karigar\labor-management-app
git add .
```

### Step 2: Commit Changes
```powershell
git commit -m "Migrated from SQLite to MongoDB - Complete backend migration"
```

### Step 3: Push to GitHub
```powershell
git push origin main
```

**✅ Done! Your code is now on GitHub with MongoDB changes.**

---

## Part 2: Update Render Backend (CRITICAL!)

### Why Update?
Your backend was using SQLite (local file). Now it uses MongoDB (cloud database).
**You MUST add MongoDB environment variables!**

### Step-by-Step:

#### 1. Login to Render
- Go to: https://render.com
- Login with your account

#### 2. Find Your Backend Service
- Click on your backend service (the one running Node.js)

#### 3. Go to Environment Tab
- Click "Environment" in the left sidebar

#### 4. Add/Update Environment Variables

**DELETE these if they exist:**
- Any variable mentioning SQLite or database paths

**ADD these new variables:**

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://yugkunjadiya007_db_user:Yug271205@cluster0.j4vnybn.mongodb.net/labor-management?retryWrites=true&w=majority&appName=Cluster0` |
| `NODE_ENV` | `production` |
| `PORT` | `5000` |

#### 5. Save Changes
- Click "Save Changes" button
- Render will automatically redeploy

#### 6. Wait for Deployment
- Watch the logs
- Look for: `✅ Connected to MongoDB`
- Status should show: **Live** (green)

#### 7. Test Backend
Open in browser:
```
https://your-backend-name.onrender.com/api/health
```

Should show:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "..."
}
```

---

## Part 3: MongoDB Atlas Setup

### Step 1: Whitelist Render's IP

#### Option A: Allow All (Easiest for Render)
1. Go to MongoDB Atlas: https://cloud.mongodb.com
2. Click "Network Access" (left sidebar)
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere"
5. Enter: `0.0.0.0/0`
6. Click "Confirm"

**✅ This allows Render to connect from any IP**

#### Option B: Specific IPs (More Secure - Paid Render Plan Required)
If you have Render paid plan with static IPs, use those specific IPs instead.

### Step 2: Verify Database
1. Go to "Database" → "Browse Collections"
2. You should see:
   - Database: `labor-management`
   - Collections: `workers`, `attendances`

---

## Part 4: Update Netlify Frontend (Optional)

### When to Update:
- If you changed frontend code
- If backend URL changed

### Step-by-Step:

#### 1. Login to Netlify
- Go to: https://netlify.com
- Login to your account

#### 2. Find Your Site
- Click on your deployed site

#### 3. Check Environment Variables
- Go to: **Site settings** → **Environment variables**
- Verify this exists:

| Key | Value |
|-----|-------|
| `REACT_APP_API_URL` | `https://your-backend-name.onrender.com/api` |

**⚠️ Replace `your-backend-name` with your actual Render URL**

#### 4. Trigger Redeploy (if needed)
- Go to **Deploys** tab
- Click "Trigger deploy" → "Deploy site"
- Wait for deployment to complete

#### 5. Test Frontend
- Open your Netlify URL
- Try adding a worker
- Try marking attendance
- Check if data saves

---

## Part 5: Verification Checklist

### ✅ GitHub
```powershell
# Check if pushed
git log --oneline -1
# Should show your latest commit
```

### ✅ Render Backend
- [ ] Environment variables added (MONGODB_URI)
- [ ] Deployment status: **Live** (green)
- [ ] Logs show: `✅ Connected to MongoDB`
- [ ] Health endpoint works
- [ ] No error logs

### ✅ MongoDB Atlas
- [ ] IP whitelist: `0.0.0.0/0` added
- [ ] Database `labor-management` exists
- [ ] Collections `workers` and `attendances` exist

### ✅ Netlify Frontend
- [ ] Site is published
- [ ] Can access the website
- [ ] Can add workers
- [ ] Can mark attendance
- [ ] Data appears in MongoDB

---

## 🐛 Common Issues & Fixes

### Issue 1: "MongoServerError: bad auth"
**Cause:** Wrong password or IP not whitelisted

**Fix:**
1. Check MONGODB_URI password is exactly: `Yug271205`
2. Verify IP whitelist in MongoDB Atlas includes `0.0.0.0/0`

### Issue 2: Backend logs show "Failed to connect to database"
**Cause:** Network issue or wrong connection string

**Fix:**
1. Copy the exact MONGODB_URI from above
2. Make sure no extra spaces in environment variable
3. Check MongoDB Atlas cluster is running (not paused)

### Issue 3: Frontend can't reach backend
**Cause:** Wrong API URL

**Fix:**
1. Get your Render backend URL
2. Add `/api` at the end
3. Set in Netlify: `REACT_APP_API_URL=https://your-backend.onrender.com/api`

### Issue 4: Data not saving
**Cause:** Backend can't write to MongoDB

**Fix:**
1. Check Render logs for errors
2. Verify MongoDB connection in logs
3. Check database user permissions in MongoDB Atlas

---

## 📝 Future Updates

Whenever you make code changes:

```powershell
# 1. Add changes
git add .

# 2. Commit
git commit -m "Describe what you changed"

# 3. Push to GitHub
git push origin main
```

**🎉 Both Render and Netlify will auto-deploy from GitHub!**

---

## 🔐 Security Checklist

- [x] `.env` file is NOT in GitHub (in .gitignore)
- [x] MongoDB password only in Render environment variables
- [x] No sensitive data in code
- [x] MongoDB IP whitelist configured

---

## 📞 Quick Support Commands

### Check Render Logs
1. Go to Render dashboard
2. Click your service
3. Click "Logs" tab
4. Look for errors or connection messages

### Check MongoDB Connection
In Render logs, you should see:
```
✅ Connected to MongoDB
✅ Database ready
```

### Test API Endpoints
```powershell
# Health check
curl https://your-backend.onrender.com/api/health

# Get workers
curl https://your-backend.onrender.com/api/workers
```

---

## ✅ Success! 

When everything works:
1. ✅ Code is on GitHub
2. ✅ Backend on Render shows "Live"
3. ✅ Frontend on Netlify loads
4. ✅ Can add workers and mark attendance
5. ✅ Data appears in MongoDB Atlas

**Your app is now fully deployed with MongoDB! 🎉**
