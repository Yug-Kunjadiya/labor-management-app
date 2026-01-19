# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Failed to fetch workers" or Worker Data Not Loading

**Symptoms:**
- Pop-up showing "Failed to fetch workers"
- Loading spinner never stops
- Worker list is empty even after adding workers

**Solutions:**

#### Solution A: Ensure Server is Running
1. Check if the backend server is running on port 5000
2. Open your browser and go to: http://localhost:5000/api/health
3. You should see: `{"status":"ok","message":"Server is running"}`
4. If not, restart the server:
   ```bash
   cd server
   node server.js
   ```

#### Solution B: Check Port Conflicts
1. Make sure no other application is using port 5000
2. To check in Windows:
   ```bash
   netstat -ano | findstr :5000
   ```
3. If port is in use, either:
   - Close the other application
   - Or change the port in `server/server.js` (line 10) and update `client/.env.development`

#### Solution C: Clear Browser Cache
1. Press `Ctrl + Shift + Delete`
2. Clear cached images and files
3. Restart the browser

#### Solution D: Database Permission Issues
1. Make sure you have write permissions in the `labor-management-app` folder
2. The app creates a `workers.db` file - ensure it can be created
3. If on Linux/Mac, check folder permissions:
   ```bash
   chmod 755 labor-management-app
   ```

### Issue 2: CORS Errors

**Symptoms:**
- Console shows "CORS policy" errors
- API requests are blocked

**Solution:**
The server already has CORS enabled. If you still see errors:
1. Make sure the frontend is running on port 3000
2. Check the server console for CORS-related errors
3. Restart both frontend and backend

### Issue 3: Database Not Created

**Symptoms:**
- Server starts but workers.db file is not created
- Errors about database tables

**Solution:**
1. Stop the server
2. Delete `workers.db` if it exists (backup first!)
3. Restart the server - it will recreate the database
4. Check server console for these messages:
   - ✅ Connected to SQLite database
   - ✅ Workers table ready
   - ✅ Attendance table ready

### Issue 4: Port Already in Use

**Symptoms:**
- Server won't start
- Error: "EADDRINUSE"

**Solution:**
1. Find what's using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   
   # Kill the process (replace PID with the actual process ID)
   taskkill /PID <PID> /F
   ```
2. Or change the port in server.js

## Pre-Deployment Checklist

Before publishing your website, ensure:

- [ ] Backend server starts without errors
- [ ] Database is created successfully (workers.db file exists)
- [ ] Frontend can fetch worker data
- [ ] You can add a new worker
- [ ] You can edit a worker
- [ ] You can delete a worker
- [ ] Attendance tracking works
- [ ] Reports generate correctly
- [ ] Both frontend and backend have proper error handling

## Testing Steps

1. **Start the application:**
   ```bash
   # Run this from labor-management-app folder
   start.bat
   ```

2. **Verify server is running:**
   - Open: http://localhost:5000/api/health
   - Should see: `{"status":"ok"}`

3. **Verify frontend loads:**
   - Open: http://localhost:3000
   - Should see the Labor Management System interface

4. **Test adding a worker:**
   - Fill in the worker form
   - Click "Add Worker"
   - Worker should appear in the list below

5. **Test editing:**
   - Click "Edit" on any worker
   - Modify details
   - Save changes

6. **Test attendance:**
   - Go to "Attendance" tab
   - Mark attendance for workers
   - Check if it saves

## Deployment to Production

### Environment Variables

For production deployment:

1. **Update API URL:**
   Edit `client/.env.production`:
   ```
   REACT_APP_API_URL=https://your-production-domain.com/api
   ```

2. **Build the frontend:**
   ```bash
   cd client
   npm run build
   ```

3. **Deploy backend:**
   - Upload `server` folder to your hosting
   - Install dependencies: `npm install`
   - Start with: `node server.js` or use PM2

4. **Deploy frontend:**
   - Upload the contents of `client/build` folder to your web host
   - Or use services like Netlify, Vercel, etc.

### Recommended Hosting Options

**Backend:**
- Render.com (Free tier available)
- Heroku
- Railway
- DigitalOcean

**Frontend:**
- Netlify (Free)
- Vercel (Free)
- GitHub Pages
- Firebase Hosting

## Quick Fix Commands

```bash
# Restart everything fresh
cd labor-management-app
# Stop all running instances first
start.bat

# Check if server is responding
curl http://localhost:5000/api/health

# Rebuild frontend
cd client
npm install
npm start

# Reinstall all dependencies
cd labor-management-app
npm run install-all
```

## Getting Help

If issues persist:
1. Check the browser console (F12) for error messages
2. Check the server terminal for error logs
3. Verify all dependencies are installed
4. Make sure you're using compatible Node.js version (v14 or higher)

## Error Messages Explained

| Error Message | Cause | Solution |
|--------------|-------|----------|
| "ERR_CONNECTION_REFUSED" | Server not running | Start server with `node server/server.js` |
| "Failed to fetch workers" | Network issue or server error | Check server is running, check network |
| "CORS policy" | Cross-origin issue | Ensure server has CORS enabled (already done) |
| "Cannot find module" | Missing dependencies | Run `npm install` |
| "EADDRINUSE" | Port already in use | Change port or kill existing process |
| "Database locked" | SQLite conflict | Close other connections to database |

---

**Last Updated:** January 19, 2026
**Version:** 1.0.0
