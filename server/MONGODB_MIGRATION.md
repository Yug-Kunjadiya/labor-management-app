# MongoDB Backend Migration Guide

## What Changed
Your backend has been successfully migrated from SQLite to MongoDB!

## MongoDB Connection String
```
mongodb+srv://yugkunjadiya007_db_user:<db_password>@cluster0.j4vnybn.mongodb.net/labor-management?retryWrites=true&w=majority
```

## Setup Instructions

### 1. Replace Database Password
Before running the server, you need to replace `<db_password>` with your actual MongoDB password in the `.env` file:

```bash
# Open server/.env and replace <db_password> with your actual password
```

### 2. Install Dependencies
Navigate to the server folder and install the new dependencies:

```bash
cd server
npm install
```

### 3. Start the Server
```bash
npm start
```

## Key Changes Made

### Files Modified:
1. **server/package.json** - Replaced `sqlite3` with `mongoose` and added `dotenv`
2. **server/server.js** - Complete rewrite to use MongoDB/Mongoose instead of SQLite
3. **server/.env** (NEW) - Environment configuration file
4. **server/models/Worker.js** (NEW) - Mongoose schema for workers
5. **server/models/Attendance.js** (NEW) - Mongoose schema for attendance

### Database Structure:
- **Workers Collection**: Stores all worker information
- **Attendance Collection**: Stores attendance records with reference to workers

### API Endpoints (No Changes):
All API endpoints remain the same:
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get single worker
- `POST /api/workers` - Add new worker
- `PUT /api/workers/:id` - Update worker
- `DELETE /api/workers/:id` - Delete worker
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/worker/:workerId` - Get worker attendance
- `GET /api/attendance/date/:date` - Get attendance by date
- `GET /api/attendance/report` - Get attendance report
- `DELETE /api/attendance/:id` - Delete attendance record

## Important Notes

1. **ID Format Change**: MongoDB uses `_id` instead of `id`. The API responses will now return `_id` for records.

2. **Data Migration**: Your existing SQLite data will NOT be automatically transferred. If you need to keep old data, you'll need to manually migrate it.

3. **Environment Variables**: The `.env` file contains sensitive information. Never commit it to version control (it's already in `.gitignore`).

4. **Cloud Database**: MongoDB is now hosted in the cloud, so you need an internet connection for the app to work.

## Troubleshooting

### Connection Issues:
- Verify your MongoDB password is correct in `.env`
- Check your internet connection
- Ensure your IP address is whitelisted in MongoDB Atlas

### Module Not Found:
```bash
cd server
npm install
```

### Port Already in Use:
Change the PORT in `.env` file or kill the process using port 5000

## Testing the Migration

1. Start the server: `npm start`
2. Check health endpoint: http://localhost:5000/api/health
3. Try adding a worker from the frontend
4. Verify data appears in MongoDB Atlas dashboard

## Next Steps

After confirming everything works:
1. Update any documentation referencing SQLite
2. Remove the old `workers.db` file if present
3. Deploy with the new MongoDB backend
