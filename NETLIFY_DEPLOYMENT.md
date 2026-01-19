# Deploy to Netlify - Step by Step Guide

This guide will help you deploy your Factory Labor Management System online.

## Important Note
Since this is a full-stack application with:
- **Frontend**: React (can be deployed on Netlify)
- **Backend**: Node.js + SQLite (needs to be deployed on a separate service)

We'll deploy the **backend on Render** (free) and **frontend on Netlify** (free).

---

## STEP 1: Deploy Backend to Render

### 1.1 Create a Render Account
1. Go to https://render.com
2. Sign up using GitHub, GitLab, or email
3. Verify your email

### 1.2 Push Your Code to GitHub (if not already done)
```powershell
# Initialize git in your project (if not already)
cd d:\karigar\labor-management-app
git init
git add .
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 1.3 Create Web Service on Render
1. Login to Render Dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `labor-management-backend` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
   - **Plan**: Select **Free**

5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)
7. Copy your backend URL (e.g., `https://labor-management-backend.onrender.com`)

### 1.4 Note Down Your Backend URL
Save this URL - you'll need it for the frontend deployment.

---

## STEP 2: Prepare Frontend for Deployment

### 2.1 Update API URL
Open `client/src/components/AttendanceManager.js`, `WorkerAttendanceCalendar.js`, and `AttendanceReport.js`

Change:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 2.2 Create Environment File for Production
Create `client/.env.production`:
```
REACT_APP_API_URL=https://YOUR-RENDER-URL.onrender.com/api
```
Replace `YOUR-RENDER-URL` with your actual Render backend URL.

### 2.3 Update App.js
In `client/src/App.js`, ensure the API_URL is using the environment variable:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
```

### 2.4 Build the Frontend
```powershell
cd client
npm run build
```

This creates an optimized production build in the `client/build` folder.

---

## STEP 3: Deploy Frontend to Netlify

### Option A: Deploy via Netlify Website (Easiest)

1. **Create Netlify Account**
   - Go to https://www.netlify.com
   - Sign up using GitHub, GitLab, or email

2. **Deploy via Drag & Drop**
   - Login to Netlify Dashboard
   - Click **"Add new site"** → **"Deploy manually"**
   - Drag and drop the `client/build` folder
   - Wait for deployment (2-3 minutes)

3. **Your site is live!**
   - Netlify will give you a URL like: `https://random-name-123.netlify.app`

### Option B: Deploy via GitHub (Recommended for Auto-Updates)

1. **Login to Netlify**
   - Go to https://app.netlify.com
   - Click **"Add new site"** → **"Import an existing project"**

2. **Connect to GitHub**
   - Select **GitHub**
   - Authorize Netlify
   - Choose your repository

3. **Configure Build Settings**
   - **Base directory**: `client`
   - **Build command**: `npm run build`
   - **Publish directory**: `client/build`

4. **Add Environment Variables**
   - Click **"Show advanced"** → **"New variable"**
   - Add: `REACT_APP_API_URL` = `https://YOUR-RENDER-URL.onrender.com/api`

5. **Deploy**
   - Click **"Deploy site"**
   - Wait 3-5 minutes

6. **Custom Domain (Optional)**
   - Click **"Domain settings"** → **"Add custom domain"**
   - Or use the free Netlify subdomain

---

## STEP 4: Configure CORS on Backend

Add your Netlify URL to the backend CORS settings.

Edit `server/server.js`:
```javascript
const cors = require('cors');

// Update CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-netlify-site.netlify.app'  // Add your Netlify URL here
  ],
  credentials: true
}));
```

Commit and push the changes - Render will auto-deploy.

---

## STEP 5: Test Your Live Website

1. Open your Netlify URL
2. Try adding a worker
3. Check attendance features
4. Verify all features work

---

## Important Notes

### Free Tier Limitations
- **Render Free Tier**: Backend may sleep after 15 minutes of inactivity (takes 30 seconds to wake up)
- **Netlify Free Tier**: 100GB bandwidth/month, 300 build minutes/month

### Database Considerations
- SQLite database on Render free tier gets reset periodically
- For production, consider upgrading or using PostgreSQL

### Keeping Backend Awake
To prevent Render from sleeping, you can:
1. Use a service like UptimeRobot to ping your backend every 10 minutes
2. Upgrade to Render paid plan ($7/month)

---

## Troubleshooting

### Backend not responding
- Check Render logs for errors
- Ensure environment variables are set correctly

### Frontend can't connect to backend
- Verify CORS is configured correctly
- Check if REACT_APP_API_URL is set correctly
- Check browser console for errors

### Build fails on Netlify
- Ensure all dependencies are in package.json
- Check build logs for specific errors
- Verify Node version compatibility

---

## Quick Deployment Checklist

- [ ] Backend deployed on Render
- [ ] Backend URL copied
- [ ] `.env.production` created with backend URL
- [ ] Frontend built successfully (`npm run build`)
- [ ] Frontend deployed on Netlify
- [ ] CORS configured on backend
- [ ] Tested all features on live site
- [ ] Custom domain configured (optional)

---

## Alternative Backend Hosting Options

If Render doesn't work for you:

1. **Railway** - https://railway.app (Free tier with $5 credit)
2. **Fly.io** - https://fly.io (Free tier available)
3. **Heroku** - https://heroku.com (Paid only now)
4. **DigitalOcean App Platform** - $5/month

---

## Support

If you encounter issues:
1. Check Netlify build logs
2. Check Render deployment logs
3. Check browser console for errors
4. Verify all environment variables are set correctly
