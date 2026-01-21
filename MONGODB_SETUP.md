# Quick Setup - MongoDB Backend

## 🚀 BEFORE YOU START

**IMPORTANT**: Update your MongoDB password first!

1. Open `server/.env`
2. Find this line:
   ```
   MONGODB_URI=mongodb+srv://yugkunjadiya007_db_user:<db_password>@cluster0.j4vnybn.mongodb.net/labor-management?retryWrites=true&w=majority
   ```
3. Replace `<db_password>` with your actual MongoDB Atlas password

## ⚡ Installation & Running

### Option 1: Using the Batch File (Windows)
```bash
# Double-click or run:
start-mongodb.bat
```

### Option 2: Manual Setup
```bash
# Navigate to server folder
cd server

# Install dependencies
npm install

# Start the server
npm start
```

## ✅ Verify It's Working

1. Server should start on: `http://localhost:5000`
2. Check health: Open browser to `http://localhost:5000/api/health`
3. You should see: `{"status":"ok","message":"Server is running","timestamp":"..."}`

## 📋 What Was Changed

✅ Replaced SQLite with MongoDB
✅ Added Mongoose ODM
✅ Created Worker and Attendance models
✅ Updated all API endpoints to use MongoDB
✅ Added environment variable support

## 🔧 Files Created/Modified

**New Files:**
- `server/.env` - MongoDB configuration
- `server/models/Worker.js` - Worker schema
- `server/models/Attendance.js` - Attendance schema
- `server/.gitignore` - Protect sensitive files
- `server/MONGODB_MIGRATION.md` - Detailed migration guide

**Modified Files:**
- `server/package.json` - Updated dependencies
- `server/server.js` - Complete MongoDB integration

## 🌐 Frontend Changes

**GOOD NEWS**: No frontend changes needed! All API endpoints work exactly the same way.

## 🚨 Common Issues

### Error: "MongooseError: The `uri` parameter to `openUri()` must be a string"
→ You forgot to replace `<db_password>` in `.env`

### Error: "ENOTFOUND cluster0.j4vnybn.mongodb.net"
→ Check your internet connection

### Error: "Cannot find module 'mongoose'"
→ Run `npm install` in the server folder

## 📊 MongoDB Atlas Dashboard

Access your database at: https://cloud.mongodb.com/
- Collections: `workers` and `attendances`
- Database name: `labor-management`

## 🎯 Next Steps

1. ✅ Update password in `.env`
2. ✅ Run `npm install` in server folder
3. ✅ Start server with `npm start`
4. ✅ Test with frontend application
5. ✅ Verify data saves to MongoDB Atlas

Need help? Check `MONGODB_MIGRATION.md` for detailed information!
