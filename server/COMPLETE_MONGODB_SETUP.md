# Complete MongoDB Setup Guide - Step by Step

## 📌 Important: MongoDB vs SQLite Difference

**SQLite (Old)**: Required creating tables with SQL commands
**MongoDB (New)**: Collections are created automatically when you insert data!

You just need:
1. ✅ Define schemas (structure) using Mongoose
2. ✅ Connect to MongoDB
3. ✅ Start inserting data - collections will be created automatically!

---

## 🔧 Step-by-Step Setup Instructions

### STEP 1: Update MongoDB Password

Open `server/.env` file and replace `<db_password>` with your actual MongoDB password:

```env
MONGODB_URI=mongodb+srv://yugkunjadiya007_db_user:YOUR_ACTUAL_PASSWORD@cluster0.j4vnybn.mongodb.net/labor-management?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
```

**Example**: If your password is `MyPass123`, it should look like:
```env
MONGODB_URI=mongodb+srv://yugkunjadiya007_db_user:MyPass123@cluster0.j4vnybn.mongodb.net/labor-management?retryWrites=true&w=majority
```

---

### STEP 2: Install Dependencies

Open terminal in the `server` folder and run:

```bash
cd server
npm install
```

This will install:
- `mongoose` - MongoDB driver
- `dotenv` - Environment variables
- `express`, `cors`, `body-parser`, `multer` - Server dependencies

---

### STEP 3: Verify File Structure

Make sure you have these files:

```
server/
├── .env                      ← MongoDB connection (password updated!)
├── package.json              ← Dependencies
├── server.js                 ← Main server file
├── models/
│   ├── Worker.js            ← Worker schema (NO table creation needed!)
│   └── Attendance.js        ← Attendance schema (NO table creation needed!)
└── uploads/                  ← Photo uploads folder
```

---

### STEP 4: Start the Server

```bash
npm start
```

**You should see:**
```
✅ Connected to MongoDB
✅ Database ready
========================================
🚀 Factory Labor Management Server
========================================
✅ Server running on: http://localhost:5000
```

---

### STEP 5: Test the Connection

Open browser and visit:
```
http://localhost:5000/api/health
```

You should see:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2026-01-21T..."
}
```

---

### STEP 6: Start Using Your App

1. Open your frontend application
2. Add a worker - MongoDB will automatically create the `workers` collection
3. Mark attendance - MongoDB will automatically create the `attendances` collection

**That's it!** No manual collection creation needed! 🎉

---

## 🗂️ Complete Code Reference

### File 1: `server/.env`
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://yugkunjadiya007_db_user:<db_password>@cluster0.j4vnybn.mongodb.net/labor-management?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
```

---

### File 2: `server/models/Worker.js`
```javascript
const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    joinDate: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: String,
        default: 'Not specified'
    },
    shift: {
        type: String,
        default: 'Not specified'
    },
    reference: {
        type: String,
        default: 'Not provided'
    },
    emergencyContact: {
        type: String,
        default: 'Not provided'
    },
    idProof: {
        type: String,
        default: 'Not provided'
    },
    idNumber: {
        type: String,
        default: 'Not provided'
    },
    notes: {
        type: String,
        default: 'None'
    },
    photo: {
        type: String,
        default: null
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt
});

// Export the model - MongoDB will create 'workers' collection automatically
module.exports = mongoose.model('Worker', workerSchema);
```

---

### File 3: `server/models/Attendance.js`
```javascript
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true
    },
    date: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Present', 'Absent', 'Half Day', 'Leave']
    },
    shiftType: {
        type: String,
        default: ''
    },
    notes: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Create compound index for unique worker+date combination
attendanceSchema.index({ workerId: 1, date: 1 }, { unique: true });

// Export the model - MongoDB will create 'attendances' collection automatically
module.exports = mongoose.model('Attendance', attendanceSchema);
```

---

### File 4: `server/package.json`
```json
{
  "name": "heli-fabrics-backend",
  "version": "1.0.0",
  "description": "HELI Fabrics Labor Management Backend API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "mongoose": "^8.0.3",
    "dotenv": "^16.3.1",
    "multer": "^1.4.5-lts.1"
  },
  "engines": {
    "node": ">=14.0.0"
  }
}
```

---

### File 5: `server/server.js` (Complete Code)
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Worker = require('./models/Worker');
const Attendance = require('./models/Attendance');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    return callback(null, true);
  },
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.NODE_ENV === 'production' 
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, 'uploads');
    
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// ==========================================
// MongoDB Connection
// ==========================================
// NO NEED TO CREATE TABLES/COLLECTIONS!
// They will be created automatically when you insert data
// ==========================================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/labor-management';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('✅ Connected to MongoDB');
    console.log('✅ Database ready');
    console.log('📝 Collections will be created automatically when you add data!');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    console.error('Failed to connect to database. Please check your connection string and network.');
    process.exit(1);
});

// Handle MongoDB connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
});

// ==========================================
// API Routes
// ==========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Get all workers
app.get('/api/workers', async (req, res) => {
    try {
        const workers = await Worker.find().sort({ createdAt: -1 });
        res.json({ workers });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ 
            error: err.message,
            workers: []
        });
    }
});

// Get single worker
app.get('/api/workers/:id', async (req, res) => {
    try {
        const worker = await Worker.findById(req.params.id);
        res.json({ worker });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add new worker
app.post('/api/workers', async (req, res) => {
    try {
        const {
            name, phone, gender, joinDate, work, address,
            salary, shift, reference, emergencyContact,
            idProof, idNumber, notes, photo
        } = req.body;

        const worker = new Worker({
            name, phone, gender, joinDate, work, address,
            salary: salary || 'Not specified',
            shift: shift || 'Not specified',
            reference: reference || 'Not provided',
            emergencyContact: emergencyContact || 'Not provided',
            idProof: idProof || 'Not provided',
            idNumber: idNumber || 'Not provided',
            notes: notes || 'None',
            photo: photo || null
        });

        const savedWorker = await worker.save();
        res.json({
            message: 'Worker added successfully',
            id: savedWorker._id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update worker
app.put('/api/workers/:id', async (req, res) => {
    try {
        const {
            name, phone, gender, joinDate, work, address,
            salary, shift, reference, emergencyContact,
            idProof, idNumber, notes, photo
        } = req.body;

        const updateData = {
            name, phone, gender, joinDate, work, address,
            salary, shift, reference, emergencyContact,
            idProof, idNumber, notes
        };

        if (photo !== undefined) {
            updateData.photo = photo;
        }

        const updatedWorker = await Worker.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json({
            message: 'Worker updated successfully',
            worker: updatedWorker
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete worker
app.delete('/api/workers/:id', async (req, res) => {
    try {
        await Attendance.deleteMany({ workerId: req.params.id });
        await Worker.findByIdAndDelete(req.params.id);
        
        res.json({
            message: 'Worker deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// Attendance Routes
// ==========================================

// Mark attendance
app.post('/api/attendance', async (req, res) => {
    try {
        const { workerId, date, status, shiftType, notes } = req.body;

        const attendance = await Attendance.findOneAndUpdate(
            { workerId, date },
            { status, shiftType: shiftType || '', notes: notes || '' },
            { upsert: true, new: true }
        );

        res.json({
            message: 'Attendance marked successfully',
            id: attendance._id
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get attendance for a worker
app.get('/api/attendance/worker/:workerId', async (req, res) => {
    try {
        const { month, year } = req.query;
        let query = { workerId: req.params.workerId };

        if (month && year) {
            const monthStr = month.toString().padStart(2, '0');
            query.date = new RegExp(`^${year}-${monthStr}`);
        }

        const attendance = await Attendance.find(query).sort({ date: -1 });
        res.json({ attendance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get attendance for all workers on a specific date
app.get('/api/attendance/date/:date', async (req, res) => {
    try {
        const attendance = await Attendance.find({ date: req.params.date })
            .populate('workerId', 'name work shift')
            .sort({ 'workerId.name': 1 });

        const transformed = attendance.map(a => ({
            _id: a._id,
            workerId: a.workerId._id,
            date: a.date,
            status: a.status,
            shiftType: a.shiftType,
            notes: a.notes,
            name: a.workerId.name,
            work: a.workerId.work,
            shift: a.workerId.shift
        }));

        res.json({ attendance: transformed });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get attendance report for all workers
app.get('/api/attendance/report', async (req, res) => {
    try {
        const { month, year } = req.query;
        
        if (!month || !year) {
            return res.status(400).json({ error: 'Month and year are required' });
        }

        const workers = await Worker.find().sort({ name: 1 });

        const monthStr = month.toString().padStart(2, '0');
        const dateRegex = new RegExp(`^${year}-${monthStr}`);

        const attendanceRecords = await Attendance.find({ date: dateRegex });

        const report = workers.map(worker => {
            const workerAttendance = attendanceRecords.filter(
                a => a.workerId.toString() === worker._id.toString()
            );

            const presentDays = workerAttendance.filter(a => a.status === 'Present').length;
            const absentDays = workerAttendance.filter(a => a.status === 'Absent').length;
            const halfDays = workerAttendance.filter(a => a.status === 'Half Day').length;
            const leaveDays = workerAttendance.filter(a => a.status === 'Leave').length;

            return {
                id: worker._id,
                name: worker.name,
                work: worker.work,
                shift: worker.shift,
                presentDays,
                absentDays,
                halfDays,
                leaveDays,
                totalMarked: workerAttendance.length
            };
        });

        res.json({ report });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get individual worker attendance report
app.get('/api/attendance/worker/:workerId', async (req, res) => {
    try {
        const { workerId } = req.params;
        const { month, year } = req.query;

        if (!workerId) {
            return res.status(400).json({ error: 'Worker ID is required' });
        }

        const worker = await Worker.findById(workerId);
        
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }

        let query = { workerId };

        if (month && year) {
            const monthStr = month.toString().padStart(2, '0');
            query.date = new RegExp(`^${year}-${monthStr}`);
        } else if (year) {
            query.date = new RegExp(`^${year}`);
        }

        const attendance = await Attendance.find(query)
            .select('date status shiftType notes createdAt')
            .sort({ date: -1 });

        const stats = {
            total: attendance.length,
            present: attendance.filter(a => a.status === 'Present').length,
            absent: attendance.filter(a => a.status === 'Absent').length,
            halfDay: attendance.filter(a => a.status === 'Half Day').length,
            leave: attendance.filter(a => a.status === 'Leave').length
        };

        res.json({
            worker,
            attendance,
            stats
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete attendance record
app.delete('/api/attendance/:id', async (req, res) => {
    try {
        await Attendance.findByIdAndDelete(req.params.id);
        res.json({
            message: 'Attendance record deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('\n========================================');
    console.log('🚀 Factory Labor Management Server');
    console.log('========================================');
    console.log(`✅ Server running on: http://localhost:${PORT}`);
    console.log(`✅ API endpoint: http://localhost:${PORT}/api`);
    console.log(`✅ Health check: http://localhost:${PORT}/api/health`);
    console.log('========================================\n');
});

// Handle shutdown
process.on('SIGINT', async () => {
    try {
        await mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
});
```

---

## ❓ Frequently Asked Questions

### Q1: Do I need to create collections manually in MongoDB?
**A:** NO! MongoDB automatically creates collections when you insert the first document. Just define the schema with Mongoose and start using it.

### Q2: Where can I see my collections?
**A:** Login to MongoDB Atlas (https://cloud.mongodb.com/) → Browse Collections → You'll see `workers` and `attendances` collections after you add data.

### Q3: What if collections don't appear?
**A:** They will appear only AFTER you add the first worker or attendance record from your frontend.

### Q4: Do I need to run any database scripts?
**A:** NO! Unlike SQLite, MongoDB doesn't need CREATE TABLE commands. Just connect and start using it.

### Q5: How do I know collections are created?
**A:** 
1. Add a worker from your frontend
2. Go to MongoDB Atlas dashboard
3. Navigate to your cluster → Collections
4. You'll see the `workers` collection

---

## 🎯 Quick Checklist

- [ ] Updated password in `server/.env`
- [ ] Ran `npm install` in server folder
- [ ] Started server with `npm start`
- [ ] Saw "✅ Connected to MongoDB" message
- [ ] Tested health endpoint: http://localhost:5000/api/health
- [ ] Added first worker from frontend
- [ ] Verified collection in MongoDB Atlas dashboard

---

## 🚨 Troubleshooting

### Server won't start?
```bash
# Make sure you're in the server folder
cd server

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Can't connect to MongoDB?
1. Check internet connection
2. Verify password in `.env` (no spaces, no `<>`)
3. Check MongoDB Atlas - ensure cluster is running
4. Whitelist your IP in MongoDB Atlas Network Access

### Collections not appearing?
- They appear only after first data insert
- Try adding a worker from frontend
- Refresh MongoDB Atlas dashboard

---

## ✅ You're Done!

No manual collection creation needed. Just:
1. Update password
2. Install dependencies
3. Run server
4. Use your app

MongoDB handles everything else automatically! 🎉
