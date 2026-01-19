const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://helifebrics.netlify.app/'  // Add your Netlify URL here
  ],
  credentials: true
}));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
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

// Database setup
const db = new sqlite3.Database('./workers.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        console.error('Failed to initialize database. Please check file permissions.');
        process.exit(1);
    } else {
        console.log('✅ Connected to SQLite database');
        console.log('Database file: ./workers.db');
        createTable();
    }
});

// Create workers table
function createTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS workers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            gender TEXT NOT NULL,
            joinDate TEXT NOT NULL,
            work TEXT NOT NULL,
            address TEXT NOT NULL,
            salary TEXT,
            shift TEXT,
            reference TEXT,
            emergencyContact TEXT,
            idProof TEXT,
            idNumber TEXT,
            notes TEXT,
            photo TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    db.run(sql, (err) => {
        if (err) {
            console.error('❌ Error creating workers table:', err);
        } else {
            console.log('✅ Workers table ready');
            createAttendanceTable();
        }
    });
}

// Create attendance table
function createAttendanceTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workerId INTEGER NOT NULL,
            date TEXT NOT NULL,
            status TEXT NOT NULL,
            shiftType TEXT,
            notes TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (workerId) REFERENCES workers(id) ON DELETE CASCADE,
            UNIQUE(workerId, date)
        )
    `;
    
    db.run(sql, (err) => {
        if (err) {
            console.error('❌ Error creating attendance table:', err);
        } else {
            console.log('✅ Attendance table ready');
            console.log('✅ Database initialization complete');
        }
    });
}

// API Routes

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Get all workers
app.get('/api/workers', (req, res) => {
    const sql = 'SELECT * FROM workers ORDER BY createdAt DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({ 
                error: err.message,
                workers: [] // Return empty array on error
            });
            return;
        }
        res.json({ workers: rows || [] });
    });
});

// Get single worker
app.get('/api/workers/:id', (req, res) => {
    const sql = 'SELECT * FROM workers WHERE id = ?';
    
    db.get(sql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ worker: row });
    });
});

// Add new worker
app.post('/api/workers', (req, res) => {
    const {
        name, phone, gender, joinDate, work, address,
        salary, shift, reference, emergencyContact,
        idProof, idNumber, notes, photo
    } = req.body;

    const sql = `
        INSERT INTO workers (
            name, phone, gender, joinDate, work, address,
            salary, shift, reference, emergencyContact,
            idProof, idNumber, notes, photo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        name, phone, gender, joinDate, work, address,
        salary || 'Not specified',
        shift || 'Not specified',
        reference || 'Not provided',
        emergencyContact || 'Not provided',
        idProof || 'Not provided',
        idNumber || 'Not provided',
        notes || 'None',
        photo || null
    ];

    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Worker added successfully',
            id: this.lastID
        });
    });
});

// Update worker
app.put('/api/workers/:id', (req, res) => {
    const {
        name, phone, gender, joinDate, work, address,
        salary, shift, reference, emergencyContact,
        idProof, idNumber, notes, photo
    } = req.body;

    // First get the existing worker to preserve photo if not provided
    const getSql = 'SELECT photo FROM workers WHERE id = ?';
    
    db.get(getSql, [req.params.id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Use provided photo or keep existing one
        const photoToUse = photo !== undefined ? photo : (row ? row.photo : null);

        const sql = `
            UPDATE workers SET
                name = ?, phone = ?, gender = ?, joinDate = ?, work = ?, address = ?,
                salary = ?, shift = ?, reference = ?, emergencyContact = ?,
                idProof = ?, idNumber = ?, notes = ?, photo = ?
            WHERE id = ?
        `;

        const params = [
            name, phone, gender, joinDate, work, address,
            salary, shift, reference, emergencyContact,
            idProof, idNumber, notes, photoToUse,
            req.params.id
        ];

        db.run(sql, params, function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Worker updated successfully',
                changes: this.changes
            });
        });
    });
});

// Delete worker
app.delete('/api/workers/:id', (req, res) => {
    const sql = 'DELETE FROM workers WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Worker deleted successfully',
            changes: this.changes
        });
    });
});

// Attendance Routes

// Mark attendance
app.post('/api/attendance', (req, res) => {
    const { workerId, date, status, shiftType, notes } = req.body;

    const sql = `
        INSERT OR REPLACE INTO attendance (workerId, date, status, shiftType, notes)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(sql, [workerId, date, status, shiftType || '', notes || ''], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Attendance marked successfully',
            id: this.lastID
        });
    });
});

// Get attendance for a worker
app.get('/api/attendance/worker/:workerId', (req, res) => {
    const { month, year } = req.query;
    let sql = 'SELECT * FROM attendance WHERE workerId = ?';
    let params = [req.params.workerId];

    if (month && year) {
        sql += ' AND strftime("%m", date) = ? AND strftime("%Y", date) = ?';
        params.push(month.padStart(2, '0'), year);
    }

    sql += ' ORDER BY date DESC';

    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ attendance: rows });
    });
});

// Get attendance for all workers on a specific date
app.get('/api/attendance/date/:date', (req, res) => {
    const sql = `
        SELECT a.*, w.name, w.work, w.shift
        FROM attendance a
        JOIN workers w ON a.workerId = w.id
        WHERE a.date = ?
        ORDER BY w.name
    `;

    db.all(sql, [req.params.date], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ attendance: rows });
    });
});

// Get attendance report for all workers
app.get('/api/attendance/report', (req, res) => {
    const { month, year } = req.query;
    
    if (!month || !year) {
        res.status(400).json({ error: 'Month and year are required' });
        return;
    }

    const sql = `
        SELECT 
            w.id,
            w.name,
            w.work,
            w.shift,
            COUNT(CASE WHEN a.status = 'Present' THEN 1 END) as presentDays,
            COUNT(CASE WHEN a.status = 'Absent' THEN 1 END) as absentDays,
            COUNT(CASE WHEN a.status = 'Half Day' THEN 1 END) as halfDays,
            COUNT(CASE WHEN a.status = 'Leave' THEN 1 END) as leaveDays,
            COUNT(*) as totalMarked
        FROM workers w
        LEFT JOIN attendance a ON w.id = a.workerId 
            AND strftime('%m', a.date) = ? 
            AND strftime('%Y', a.date) = ?
        GROUP BY w.id, w.name, w.work, w.shift
        ORDER BY w.name
    `;

    db.all(sql, [month.padStart(2, '0'), year], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ report: rows });
    });
});

// Get individual worker attendance report
app.get('/api/attendance/worker/:workerId', (req, res) => {
    const { workerId } = req.params;
    const { month, year } = req.query;

    if (!workerId) {
        res.status(400).json({ error: 'Worker ID is required' });
        return;
    }

    // Get worker details
    const workerSql = 'SELECT * FROM workers WHERE id = ?';
    
    db.get(workerSql, [workerId], (err, worker) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!worker) {
            res.status(404).json({ error: 'Worker not found' });
            return;
        }

        // Build attendance query based on filters
        let attendanceSql = `
            SELECT 
                date,
                status,
                shiftType,
                notes,
                createdAt
            FROM attendance 
            WHERE workerId = ?
        `;
        
        const params = [workerId];

        if (month && year) {
            attendanceSql += ` AND strftime('%m', date) = ? AND strftime('%Y', date) = ?`;
            params.push(month.toString().padStart(2, '0'), year.toString());
        } else if (year) {
            attendanceSql += ` AND strftime('%Y', date) = ?`;
            params.push(year.toString());
        }

        attendanceSql += ' ORDER BY date DESC';

        db.all(attendanceSql, params, (err, attendance) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }

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
        });
    });
});

// Delete attendance record
app.delete('/api/attendance/:id', (req, res) => {
    const sql = 'DELETE FROM attendance WHERE id = ?';
    
    db.run(sql, [req.params.id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Attendance record deleted successfully',
            changes: this.changes
        });
    });
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
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed');
        process.exit(0);
    });
});
