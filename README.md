# Factory Labor Management System

A full-stack web application built with React and Node.js to manage factory workers.

## Features

### Worker Management
- ✅ Add, view, edit, and delete workers
- ✅ Upload worker photos
- ✅ Search and filter workers by name, position, gender
- ✅ Export worker data to CSV
- ✅ Print worker list
- ✅ Comprehensive worker details (ID proof, emergency contact, salary, shift, etc.)

### Attendance Management
- ✅ Mark daily attendance (Present, Absent, Half Day, Leave)
- ✅ Track shift type (Day/Night shift)
- ✅ Bulk attendance submission
- ✅ View attendance by date
- ✅ Add notes to attendance records

### Reports & Analytics
- ✅ Monthly attendance reports for all workers
- ✅ Individual worker attendance calendar view
- ✅ Visual calendar with color-coded attendance status
- ✅ Attendance statistics and percentages
- ✅ Export reports to CSV
- ✅ Print-friendly reports

### Technical Features
- ✅ Persistent data storage with SQLite database
- ✅ RESTful API backend
- ✅ Responsive design
- ✅ Tab-based navigation
- ✅ Real-time data updates

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm

### Setup Steps

1. **Install backend dependencies:**
   ```powershell
   cd d:\karigar\labor-management-app
   npm install
   ```

2. **Install frontend dependencies:**
   ```powershell
   cd client
   npm install
   ```

## Running the Application

### Option 1: Run both frontend and backend together
```powershell
cd d:\karigar\labor-management-app
npm run dev
```

### Option 2: Run separately

**Terminal 1 - Start Backend Server:**
```powershell
cd d:\karigar\labor-management-app
npm run server
```

**Terminal 2 - Start React Frontend:**
```powershell
cd d:\karigar\labor-management-app\client
npm start
```

## Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Database

The application uses SQLite database (`workers.db`) which is created automatically in the project root. All worker data is stored persistently.

## Project Structure

```
labor-management-app/
├── server/
│   ├── server.js          # Node.js backend API
│   └── uploads/           # Worker photos storage
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorkerForm.js
│   │   │   ├── WorkerList.js
│   │   │   ├── WorkerCard.js
│   │   │   ├── AttendanceManager.js
│   │   │   ├── AttendanceReport.js
│   │   │   └── WorkerAttendanceCalendar.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── package.json
└── workers.db             # SQLite database (auto-generated)
```

## API Endpoints

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get single worker
- `POST /api/workers` - Add new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/date/:date` - Get attendance for a specific date
- `GET /api/attendance/worker/:workerId` - Get worker's attendance history
- `GET /api/attendance/report` - Get monthly attendance report
- `DELETE /api/attendance/:id` - Delete attendance record

## Deployment

See [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md) for detailed instructions on deploying this application to production using Netlify (frontend) and Render (backend).

## Technologies Used

### Frontend
- React.js
- Axios for API calls
- CSS3 for styling
- Responsive design

### Backend
- Node.js
- Express.js
- SQLite3 database
- CORS middleware
- Multer for file uploads

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available for educational purposes.
