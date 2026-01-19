# Deploy HELI Fabrics to Render.com

## Complete Deployment Guide

### Prerequisites
- GitHub account (free)
- Render.com account (free)

---

## Step 1: Prepare Your Project

### 1.1 Create Backend Package.json (if not exists)

Create `server/package.json`:
```json
{
  "name": "heli-fabrics-backend",
  "version": "1.0.0",
  "description": "Labor Management Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "sqlite3": "^5.1.6",
    "multer": "^1.4.5-lts.1"
  }
}
```

### 1.2 Update Server for Production

Your server.js should use environment PORT:
```javascript
const PORT = process.env.PORT || 5000;
```

---

## Step 2: Push to GitHub

### 2.1 Initialize Git (if not done)
```bash
cd d:\karigar\labor-management-app
git init
git add .
git commit -m "Initial commit - HELI Fabrics Labor Management"
```

### 2.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `heli-fabrics-management`
3. Make it Public or Private
4. Click "Create repository"

### 2.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/heli-fabrics-management.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Backend on Render

### 3.1 Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended)

### 3.2 Create Web Service for Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `heli-fabrics-backend`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

4. **Environment Variables** (Add these):
   - Key: `NODE_ENV`, Value: `production`

5. Click "Create Web Service"

### 3.3 Wait for Deployment
- Initial deployment takes 2-5 minutes
- You'll get a URL like: `https://heli-fabrics-backend.onrender.com`
- **Copy this URL** - you'll need it!

---

## Step 4: Deploy Frontend on Render

### 4.1 Update API URL in Frontend

Before deploying frontend, update the backend URL:

**File: `client/src/App.js`**
```javascript
const API_URL = 'https://heli-fabrics-backend.onrender.com/api';
```

**File: `client/src/components/AttendanceManager.js`**
```javascript
const API_URL = 'https://heli-fabrics-backend.onrender.com/api';
```

**File: `client/src/components/AttendanceReport.js`**
```javascript
const API_URL = 'https://heli-fabrics-backend.onrender.com/api';
```

### 4.2 Commit Changes
```bash
git add .
git commit -m "Update API URL for production"
git push
```

### 4.3 Create Static Site for Frontend
1. In Render Dashboard, click "New +" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `heli-fabrics-frontend`
   - **Branch**: `main`
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

4. Click "Create Static Site"

### 4.4 Wait for Deployment
- Takes 2-5 minutes
- You'll get a URL like: `https://heli-fabrics-frontend.onrender.com`

---

## Step 5: Update Backend CORS

After frontend is deployed, update backend CORS to allow your frontend URL.

**File: `server/server.js`**
```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://heli-fabrics-frontend.onrender.com'  // Add your frontend URL
  ],
  credentials: true
};

app.use(cors(corsOptions));
```

Commit and push:
```bash
git add .
git commit -m "Update CORS for production"
git push
```

Render will auto-deploy the backend again.

---

## Step 6: Test Your Deployment

1. Open your frontend URL: `https://heli-fabrics-frontend.onrender.com`
2. Try adding a worker
3. Check attendance features
4. Verify reports work

---

## Important Notes

### Free Tier Limitations
- Backend sleeps after 15 minutes of inactivity
- First request after sleep takes 30-60 seconds to wake up
- Database is SQLite (local file) - resets on redeploy

### Database Persistence
For permanent data storage on free tier:
1. Data persists during runtime
2. Redeploying backend will reset database
3. **Upgrade Options:**
   - Use Render PostgreSQL (paid)
   - Use external MongoDB Atlas (free tier)
   - Use Supabase PostgreSQL (free tier)

### Custom Domain (Optional)
1. Go to your static site settings
2. Click "Custom Domains"
3. Add your domain
4. Follow DNS instructions

---

## Troubleshooting

### Backend won't start
- Check Render logs in dashboard
- Verify all dependencies in package.json
- Check PORT environment variable

### Frontend can't connect to backend
- Verify API_URL is correct with `/api` at end
- Check backend CORS settings
- Check browser console for errors

### Database issues
- SQLite creates `workers.db` automatically
- Check Render backend logs for database errors

---

## Quick Reference

### Your URLs (after deployment):
- **Frontend**: `https://heli-fabrics-frontend.onrender.com`
- **Backend**: `https://heli-fabrics-backend.onrender.com`
- **API Endpoint**: `https://heli-fabrics-backend.onrender.com/api`

### Update Frequency:
- Push to GitHub → Auto-deploy on Render
- Backend redeploys in ~2 minutes
- Frontend redeploys in ~3 minutes

---

## Cost
- ✅ **FREE** for both frontend and backend
- No credit card required
- 750 hours/month free (backend)
- Unlimited static site hosting (frontend)

**Your HELI Fabrics Labor Management System will be live! 🎉**
