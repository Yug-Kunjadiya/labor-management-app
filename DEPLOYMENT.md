# HELI Fabrics - Labor Management System

## Deployment Instructions for Netlify

### Frontend Deployment (Client)

The React application has been built and is ready for deployment.

**Build Output Location:** `client/build/`

### Steps to Deploy on Netlify:

1. **Login to Netlify**
   - Go to https://app.netlify.com
   - Sign up or login with your account

2. **Deploy via Drag & Drop**
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `client/build` folder
   - Your site will be deployed instantly

3. **Deploy via Git (Recommended)**
   - Push this repository to GitHub/GitLab/Bitbucket
   - Click "Add new site" → "Import an existing project"
   - Connect to your Git repository
   - Build settings are already configured in `netlify.toml`
   - Click "Deploy site"

### Backend Setup (Important!)

⚠️ **Note:** Netlify only hosts static files (frontend). Your backend needs to be hosted separately.

**Backend Hosting Options:**

1. **Render.com** (Free tier available)
   - Sign up at https://render.com
   - Create new "Web Service"
   - Connect your repository
   - Set build command: `cd server && npm install`
   - Set start command: `node server/server.js`
   - Deploy

2. **Railway.app** (Free tier available)
   - Deploy Node.js backend easily
   - Automatic HTTPS

3. **Heroku** (Paid)
   - Classic Node.js hosting platform

### After Backend Deployment:

1. Get your backend URL (e.g., `https://your-app.onrender.com`)
2. Update the API URL in `client/src/App.js`:
   ```javascript
   const API_URL = 'https://your-backend-url.com/api';
   ```
3. Update the API URL in all component files:
   - `client/src/components/AttendanceManager.js`
   - `client/src/components/AttendanceReport.js`
4. Rebuild and redeploy

### Environment Variables (for Backend):

Set these on your backend hosting platform:
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Set to "production"

### Database:

The SQLite database (`workers.db`) will be created automatically on the backend server.
For production, consider upgrading to PostgreSQL or MySQL for better reliability.

### Local Testing:

To test the production build locally:
```bash
cd client
npm install -g serve
serve -s build
```

### Files Included:

- ✅ `client/build/` - Production build folder
- ✅ `netlify.toml` - Netlify configuration
- ✅ `server/server.js` - Backend API server
- ✅ `server/workers.db` - SQLite database (auto-created)

### Site URL:

After deployment, Netlify will provide a URL like:
`https://random-name-12345.netlify.app`

You can customize this in Netlify settings.

---

**Need Help?** Check Netlify documentation: https://docs.netlify.com
