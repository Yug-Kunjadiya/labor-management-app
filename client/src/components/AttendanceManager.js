import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AttendanceManager({ workers }) {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [pendingChanges, setPendingChanges] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchAttendanceForDate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/attendance/date/${selectedDate}`);
      const data = {};
      response.data.attendance.forEach(record => {
        data[record.workerId] = {
          status: record.status,
          shiftType: record.shiftType,
          notes: record.notes,
          id: record.id
        };
      });
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceForDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const markAttendance = (workerId, status, shiftType) => {
    setPendingChanges(prev => ({
      ...prev,
      [workerId]: { status, shiftType, notes: '' }
    }));
  };

  const submitAllAttendance = async () => {
    const changesCount = Object.keys(pendingChanges).length;
    if (changesCount === 0) {
      alert('No attendance changes to submit!');
      return;
    }

    if (!window.confirm(`Submit attendance for ${changesCount} worker(s)?`)) {
      return;
    }

    try {
      setSubmitting(true);
      const promises = Object.entries(pendingChanges).map(([workerId, data]) => 
        axios.post(`${API_URL}/attendance`, {
          workerId,
          date: selectedDate,
          status: data.status,
          shiftType: data.shiftType,
          notes: data.notes
        })
      );
      
      await Promise.all(promises);
      alert(`Successfully submitted attendance for ${changesCount} worker(s)!`);
      setPendingChanges({});
      fetchAttendanceForDate();
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to submit some attendance records. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const clearPendingChanges = () => {
    if (Object.keys(pendingChanges).length > 0) {
      if (window.confirm('Clear all pending changes?')) {
        setPendingChanges({});
      }
    }
  };

  const getAttendanceStatus = (workerId) => {
    if (pendingChanges[workerId]) {
      return pendingChanges[workerId].status;
    }
    return attendanceData[workerId]?.status || 'Not Marked';
  };

  const getShiftType = (workerId) => {
    if (pendingChanges[workerId]) {
      return pendingChanges[workerId].shiftType;
    }
    return attendanceData[workerId]?.shiftType || '';
  };

  const hasPendingChange = (workerId) => {
    return !!pendingChanges[workerId];
  };

  return (
    <div className="attendance-manager">
      <div className="attendance-header" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '25px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '8px'
      }}>
        <h2 style={{ margin: 0 }}>Mark Daily Attendance</h2>
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Date:</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="date-input"
            style={{ padding: '8px 12px', fontSize: '15px', borderRadius: '5px', border: '1px solid #ddd' }}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading" style={{ textAlign: 'center', padding: '40px', fontSize: '16px' }}>Loading attendance...</div>
      ) : (
        <div>
          <table className="attendance-table" style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ background: '#007bff', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Worker Name</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Position</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Regular Shift</th>
                <th style={{ padding: '15px', textAlign: 'center', minWidth: '180px' }}>Status</th>
                <th style={{ padding: '15px', textAlign: 'center' }}>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {workers.map(worker => {
                const workerId = worker._id || worker.id;
                const isPending = hasPendingChange(workerId);
                const status = getAttendanceStatus(workerId);
                const shiftType = getShiftType(workerId);
                
                return (
                  <tr 
                    key={workerId} 
                    style={{
                      background: isPending ? '#e3f2fd' : 'white',
                      borderBottom: '1px solid #dee2e6',
                      transition: 'all 0.2s'
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: '500' }}>{worker.name}</td>
                    <td style={{ padding: '12px' }}>{worker.work}</td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{ 
                        background: '#e9ecef', 
                        padding: '4px 12px', 
                        borderRadius: '15px',
                        fontSize: '13px'
                      }}>
                        {worker.shift}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center' }}>
                        {status === 'Present' && shiftType ? (
                          <span style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            background: shiftType === 'Day Shift' ? '#28a745' : '#17a2b8',
                            color: 'white'
                          }}>
                            {shiftType === 'Day Shift' ? 'DAY SHIFT' : 'NIGHT SHIFT'}
                          </span>
                        ) : (
                          <span className={`status-badge status-${status.toLowerCase().replace(' ', '-')}`} style={{
                            display: 'inline-block',
                            padding: '6px 14px',
                            borderRadius: '20px',
                            fontSize: '13px',
                            fontWeight: '600',
                            textTransform: 'uppercase'
                          }}>
                            {status}
                          </span>
                        )}
                        {isPending && (
                          <span style={{ fontSize: '11px', color: '#1976d2', fontStyle: 'italic', fontWeight: '600' }}>Pending</span>
                        )}
                      </div>
                    </td>
                    <td className="action-buttons" style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                          onClick={() => markAttendance(workerId, 'Present', 'Day Shift')}
                          className="btn-attendance"
                          style={{
                            background: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          title="Mark Present - Day Shift"
                        >
                          Day
                        </button>
                        <button
                          onClick={() => markAttendance(workerId, 'Present', 'Night Shift')}
                          className="btn-attendance"
                          style={{
                            background: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          title="Mark Present - Night Shift"
                        >
                          Night
                        </button>
                        <button
                          onClick={() => markAttendance(workerId, 'Absent', '')}
                          className="btn-attendance"
                          style={{
                            background: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          title="Mark Absent"
                        >
                          Absent
                        </button>
                        <button
                          onClick={() => markAttendance(workerId, 'Half Day', '')}
                          className="btn-attendance"
                          style={{
                            background: '#ffc107',
                            color: '#000',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '5px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                          title="Mark Half Day"
                        >
                          Half Day
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {Object.keys(pendingChanges).length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
              padding: '25px',
              borderRadius: '10px',
              marginTop: '25px',
              border: '2px solid #1976d2',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '20px' }}>📝</span>
                <h3 style={{ margin: 0, color: '#1565c0' }}>
                  {Object.keys(pendingChanges).length} Pending Change{Object.keys(pendingChanges).length > 1 ? 's' : ''}
                </h3>
              </div>
              <p style={{ margin: '0 0 20px 0', color: '#1565c0', fontSize: '14px' }}>
                Please review the marked attendance above and click the button below to save all changes.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={submitAllAttendance}
                  disabled={submitting}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    padding: '14px 35px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  {submitting ? 'Saving...' : `Save ${Object.keys(pendingChanges).length} Attendance Record${Object.keys(pendingChanges).length > 1 ? 's' : ''}`}
                </button>
                <button
                  onClick={clearPendingChanges}
                  disabled={submitting}
                  style={{
                    background: '#6c757d',
                    color: 'white',
                    padding: '14px 25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s'
                  }}
                >
                  Cancel Changes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AttendanceManager;
