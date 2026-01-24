import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function WorkerAttendanceCalendar({ workers }) {
  const [selectedWorker, setSelectedWorker] = useState('');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkerAttendance = async () => {
    if (!selectedWorker) return;
    
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/attendance/worker/${selectedWorker}`, {
        params: { month, year }
      });
      setAttendanceData(response.data.attendance || []);
    } catch (error) {
      console.error('Error fetching worker attendance:', error);
      setAttendanceData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedWorker) {
      fetchWorkerAttendance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWorker, month, year]);

  const getDaysInMonth = () => {
    return new Date(year, month, 0).getDate();
  };

  const getAttendanceForDay = (day) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceData.find(att => att.date.startsWith(dateStr));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present':
        return '#4caf50';
      case 'Absent':
        return '#f44336';
      case 'Half Day':
        return '#ff9800';
      case 'Leave':
        return '#2196f3';
      default:
        return '#e0e0e0';
    }
  };

  const getStatusShort = (status) => {
    switch (status) {
      case 'Present':
        return 'P';
      case 'Absent':
        return 'A';
      case 'Half Day':
        return 'H';
      case 'Leave':
        return 'L';
      default:
        return '-';
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = new Date(year, month - 1, 1).getDay();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const attendance = getAttendanceForDay(day);
      const status = attendance ? attendance.status : 'Not Marked';
      const shiftType = attendance ? attendance.shiftType : '';
      const notes = attendance ? attendance.notes : '';

      days.push(
        <div
          key={day}
          className="calendar-day"
          style={{
            backgroundColor: getStatusColor(status),
            color: status === 'Not Marked' ? '#333' : 'white',
            border: status === 'Not Marked' ? '1px solid #ddd' : 'none'
          }}
          title={`${day}: ${status}${shiftType ? ` (${shiftType})` : ''}${notes ? ` - ${notes}` : ''}`}
        >
          <div className="day-number">{day}</div>
          <div className="day-status">{getStatusShort(status)}</div>
          {shiftType && status !== 'Not Marked' && (
            <div className="day-shift">{shiftType === 'Day Shift' ? 'D' : 'N'}</div>
          )}
        </div>
      );
    }

    return days;
  };

  const calculateStats = () => {
    const stats = {
      present: 0,
      absent: 0,
      halfDay: 0,
      leave: 0,
      total: attendanceData.length
    };

    attendanceData.forEach(att => {
      switch (att.status) {
        case 'Present':
          stats.present++;
          break;
        case 'Absent':
          stats.absent++;
          break;
        case 'Half Day':
          stats.halfDay++;
          break;
        case 'Leave':
          stats.leave++;
          break;
        default:
          break;
      }
    });

    return stats;
  };

  const stats = selectedWorker ? calculateStats() : null;
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
  const selectedWorkerData = workers.find(w => (w._id || w.id) === selectedWorker);

  return (
    <div className="worker-attendance-calendar">
      <h2>Individual Worker Attendance Calendar</h2>

      <div className="calendar-filters">
        <div className="form-group">
          <label>Select Worker:</label>
          <select 
            value={selectedWorker} 
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="filter-select"
          >
            <option value="">-- Select a Worker --</option>
            {workers.map(worker => {
              const workerId = worker._id || worker.id;
              return (
                <option key={workerId} value={workerId}>
                  {worker.name} - {worker.work}
                </option>
              );
            })}
          </select>
        </div>

        <div className="form-group">
          <label>Month:</label>
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))} 
            className="filter-select"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Year:</label>
          <select 
            value={year} 
            onChange={(e) => setYear(Number(e.target.value))} 
            className="filter-select"
          >
            {[...Array(5)].map((_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>
      </div>

      {!selectedWorker ? (
        <div className="no-selection">
          <p>Please select a worker to view their attendance calendar</p>
        </div>
      ) : loading ? (
        <div className="loading">Loading attendance data...</div>
      ) : (
        <div className="calendar-container">
          {selectedWorkerData && (
            <div className="worker-details">
              <h3>{selectedWorkerData.name}</h3>
              <p><strong>Position:</strong> {selectedWorkerData.work}</p>
              <p><strong>Regular Shift:</strong> {selectedWorkerData.shift}</p>
              <p><strong>Phone:</strong> {selectedWorkerData.phone}</p>
            </div>
          )}

          <div className="calendar-header">
            <h3>{monthName} {year}</h3>
          </div>

          {stats && (
            <div className="attendance-stats">
              <div className="stat-item stat-present">
                <span className="stat-label">Present</span>
                <span className="stat-value">{stats.present}</span>
              </div>
              <div className="stat-item stat-absent">
                <span className="stat-label">Absent</span>
                <span className="stat-value">{stats.absent}</span>
              </div>
              <div className="stat-item stat-half">
                <span className="stat-label">Half Day</span>
                <span className="stat-value">{stats.halfDay}</span>
              </div>
              <div className="stat-item stat-leave">
                <span className="stat-label">Leave</span>
                <span className="stat-value">{stats.leave}</span>
              </div>
              <div className="stat-item stat-total">
                <span className="stat-label">Total Marked</span>
                <span className="stat-value">{stats.total}</span>
              </div>
            </div>
          )}

          <div className="calendar-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#4caf50' }}></span>
              <span>Present (P)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#f44336' }}></span>
              <span>Absent (A)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#ff9800' }}></span>
              <span>Half Day (H)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#2196f3' }}></span>
              <span>Leave (L)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: '#e0e0e0' }}></span>
              <span>Not Marked (-)</span>
            </div>
          </div>

          <div className="calendar-weekdays">
            <div className="weekday">Sun</div>
            <div className="weekday">Mon</div>
            <div className="weekday">Tue</div>
            <div className="weekday">Wed</div>
            <div className="weekday">Thu</div>
            <div className="weekday">Fri</div>
            <div className="weekday">Sat</div>
          </div>

          <div className="calendar-grid">
            {renderCalendar()}
          </div>

          {attendanceData.length === 0 && (
            <div className="no-data">
              <p>No attendance records found for this month</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WorkerAttendanceCalendar;
