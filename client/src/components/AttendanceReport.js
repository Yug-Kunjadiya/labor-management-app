import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AttendanceReport() {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/attendance/report`, {
        params: { month, year }
      });
      setReportData(response.data.report || []);
    } catch (error) {
      console.error('Error fetching report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const exportToCSV = () => {
    if (reportData.length === 0) {
      alert('No data to export!');
      return;
    }

    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });
    const headers = ['Worker Name', 'Work/Position', 'Shift', 'Present Days', 'Absent Days', 'Half Days', 'Leave Days', 'Total Marked'];
    const csvContent = [
      headers.join(','),
      ...reportData.map(w => [
        `"${w.name}"`,
        `"${w.work}"`,
        `"${w.shift}"`,
        w.presentDays,
        w.absentDays,
        w.halfDays,
        w.leaveDays,
        w.totalMarked
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_report_${monthName}_${year}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printReport = () => {
    window.print();
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  return (
    <div className="attendance-report">
      <h2>Monthly Attendance Report</h2>

      <div className="report-filters">
        <div className="form-group">
          <label>Month:</label>
          <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="filter-select">
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Year:</label>
          <select value={year} onChange={(e) => setYear(Number(e.target.value))} className="filter-select">
            {[...Array(5)].map((_, i) => {
              const y = new Date().getFullYear() - i;
              return <option key={y} value={y}>{y}</option>;
            })}
          </select>
        </div>

        <button onClick={exportToCSV} className="export-btn">Export CSV</button>
        <button onClick={printReport} className="export-btn">Print</button>
      </div>

      <div className="report-summary">
        <h3>{monthName} {year} - Attendance Summary</h3>
        <p>Total Workers: {reportData.length}</p>
      </div>

      {loading ? (
        <div className="loading">Loading report...</div>
      ) : (
        <div className="report-table-container">
          <table className="report-table">
            <thead>
              <tr>
                <th>Worker Name</th>
                <th>Work/Position</th>
                <th>Regular Shift</th>
                <th>Present</th>
                <th>Absent</th>
                <th>Half Day</th>
                <th>Leave</th>
                <th>Total Days</th>
                <th>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map(worker => {
                const workerId = worker._id || worker.id;
                const attendancePercent = worker.totalMarked > 0 
                  ? ((worker.presentDays + (worker.halfDays * 0.5)) / worker.totalMarked * 100).toFixed(1)
                  : 'N/A';
                
                return (
                  <tr key={workerId}>
                    <td>{worker.name}</td>
                    <td>{worker.work}</td>
                    <td>{worker.shift}</td>
                    <td className="present-cell">{worker.presentDays}</td>
                    <td className="absent-cell">{worker.absentDays}</td>
                    <td className="half-cell">{worker.halfDays}</td>
                    <td className="leave-cell">{worker.leaveDays}</td>
                    <td>{worker.totalMarked}</td>
                    <td className={attendancePercent >= 90 ? 'good-attendance' : attendancePercent >= 75 ? 'avg-attendance' : 'poor-attendance'}>
                      {attendancePercent !== 'N/A' ? `${attendancePercent}%` : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AttendanceReport;
