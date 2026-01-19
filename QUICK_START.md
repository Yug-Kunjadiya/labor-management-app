# 🏭 Factory Labor Management System - Quick Start Guide

## ✅ Your React + Node.js Application is Ready!

### Current Status:
- ✅ Backend Server: Running on http://localhost:5000
- ✅ React Frontend: Running on http://localhost:3000
- ✅ SQLite Database: Created and ready

## 🚀 How to Use

### Access the Application
Open your browser and go to: **http://localhost:3000**

### Features:
1. **Add Workers** - Fill the form and click "Add Worker"
2. **View All Workers** - See all workers with complete details
3. **Search/Filter** - Search by name, phone, or work; Filter by gender
4. **Delete Workers** - Click delete button on any worker card
5. **Export to CSV** - Download all worker data as CSV file
6. **Print** - Print the worker list
7. **Persistent Data** - All data is saved in SQLite database (workers.db)

### Data Persistence:
✅ Your data is saved in a SQLite database
✅ Close the app and reopen - all data remains
✅ Works even after computer restart

## 🔄 How to Start Again (Next Time)

### Option 1: Use the Start Script
Double-click `start.bat` in the folder `d:\karigar\labor-management-app\`

### Option 2: Manual Start

**Terminal 1 - Backend:**
```powershell
cd d:\karigar\labor-management-app
node server/server.js
```

**Terminal 2 - Frontend:**
```powershell
cd d:\karigar\labor-management-app\client
npm start
```

## 📂 Important Files

- **workers.db** - Your database file (contains all worker data)
- **server/server.js** - Backend API server
- **client/src/** - React frontend code
- **start.bat** - Quick start script

## 🛑 How to Stop

Press `Ctrl + C` in both terminal windows

## 📝 Notes

- Always run both backend AND frontend to use the app
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Database file location: `d:\karigar\labor-management-app\workers.db`

---

## 🎉 Enjoy Your Labor Management System!
