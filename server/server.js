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
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow all origins for now (you can restrict this later)
    return callback(null, true);
  },
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = process.env.NODE_ENV === 'production' 
    ? path.join('/tmp', 'uploads')  // Use /tmp on Render
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

// MongoDB Connection
const MONGODB_URI = 'mongodb+srv://yugkunjadiya007_db_user:Yug271205@cluster0.j4vnybn.mongodb.net/labor-management?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log('✅ Database ready');
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

// API Routes

// Root endpoint - Welcome page
app.get('/', (req, res) => {
    res.json({
        message: '🚀 Factory Labor Management API',
        version: '1.0.0',
        status: 'running',
        database: 'MongoDB',
        endpoints: {
            health: '/api/health',
            workers: '/api/workers',
            attendance: '/api/attendance'
        },
        documentation: 'All endpoints are prefixed with /api'
    });
});

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

        // Only update photo if provided
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
        // Also delete all attendance records for this worker
        await Attendance.deleteMany({ workerId: req.params.id });
        await Worker.findByIdAndDelete(req.params.id);
        
        res.json({
            message: 'Worker deleted successfully'
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Attendance Routes

// Mark attendance
app.post('/api/attendance', async (req, res) => {
    try {
        const { workerId, date, status, shiftType, notes } = req.body;

        console.log('📝 Marking attendance:', { workerId, date, status, shiftType });

        // Validate required fields
        if (!workerId || !date || !status) {
            return res.status(400).json({ 
                error: 'Missing required fields: workerId, date, and status are required' 
            });
        }

        // Verify worker exists
        const workerExists = await Worker.findById(workerId);
        if (!workerExists) {
            return res.status(404).json({ 
                error: `Worker with ID ${workerId} not found` 
            });
        }

        // Use findOneAndUpdate with upsert to replace if exists
        const attendance = await Attendance.findOneAndUpdate(
            { workerId, date },
            { 
                workerId,
                date,
                status, 
                shiftType: shiftType || '', 
                notes: notes || '' 
            },
            { upsert: true, new: true, runValidators: true }
        );

        console.log('✅ Attendance saved:', attendance);

        res.json({
            message: 'Attendance marked successfully',
            id: attendance._id,
            attendance
        });
    } catch (err) {
        console.error('❌ Error marking attendance:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get attendance for a worker
app.get('/api/attendance/worker/:workerId', async (req, res) => {
    try {
        const { month, year } = req.query;
        let query = { workerId: req.params.workerId };

        if (month && year) {
            // Filter by month and year using regex on date string
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

        // Transform to match expected format
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

        // Get all workers
        const workers = await Worker.find().sort({ name: 1 });

        // Build date filter for attendance
        const monthStr = month.toString().padStart(2, '0');
        const dateRegex = new RegExp(`^${year}-${monthStr}`);

        // Get attendance for the month
        const attendanceRecords = await Attendance.find({ date: dateRegex });

        // Build report for each worker
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

        // Get worker details
        const worker = await Worker.findById(workerId);
        
        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }

        // Build attendance query based on filters
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

        // Calculate statistics
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
