# Factory Labor Management System

A full-stack web application built with React and Node.js to manage factory workers.

## Features

- ✅ Add, view, and delete workers
- ✅ Upload worker photos
- ✅ Search and filter workers
- ✅ Export data to CSV
- ✅ Print worker list
- ✅ Persistent data storage with SQLite database
- ✅ Responsive design

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
│   └── server.js          # Node.js backend API
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── WorkerForm.js
│   │   │   ├── WorkerList.js
│   │   │   └── WorkerCard.js
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
├── package.json
└── workers.db             # SQLite database (auto-generated)
```

## API Endpoints

- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get single worker
- `POST /api/workers` - Add new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker
