import React, { useState, useEffect } from 'react';
import './App.css';
import WorkerForm from './components/WorkerForm';
import WorkerList from './components/WorkerList';
import AttendanceManager from './components/AttendanceManager';
import AttendanceReport from './components/AttendanceReport';
import WorkerAttendanceCalendar from './components/WorkerAttendanceCalendar';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [activeTab, setActiveTab] = useState('workers'); // 'workers', 'attendance', 'report'

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/workers`, {
        timeout: 30000
      });
      setWorkers(response.data.workers || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
      setWorkers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch workers from backend
  useEffect(() => {
    fetchWorkers();
  }, []);

  const addWorker = async (workerData) => {
    try {
      const response = await axios.post(`${API_URL}/workers`, workerData, {
        timeout: 30000
      });
      alert('Worker added successfully!');
      await fetchWorkers(); // Refresh the list
    } catch (error) {
      console.error('Error adding worker:', error);
      alert('Failed to add worker: ' + error.message);
    }
  };

  const deleteWorker = async (id) => {
    if (window.confirm('Are you sure you want to delete this worker?')) {
      try {
        await axios.delete(`${API_URL}/workers/${id}`);
        fetchWorkers(); // Refresh the list
      } catch (error) {
        console.error('Error deleting worker:', error);
        alert('Failed to delete worker');
      }
    }
  };

  const editWorker = async (id, updatedData) => {
    try {
      await axios.put(`${API_URL}/workers/${id}`, updatedData, {
        timeout: 30000
      });
      alert('Worker updated successfully!');
      await fetchWorkers(); // Refresh the list
    } catch (error) {
      console.error('Error updating worker:', error);
      alert('Failed to update worker: ' + error.message);
    }
  };

  const exportToCSV = () => {
    if (workers.length === 0) {
      alert('No workers to export!');
      return;
    }

    const headers = ['Name', 'Gender', 'Phone', 'Reference', 'Work', 'Shift', 'Salary', 'Joining Date', 'Address', 'Emergency Contact', 'ID Proof', 'ID Number', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...workers.map(w => [
        `"${w.name}"`,
        `"${w.gender}"`,
        `"${w.phone}"`,
        `"${w.reference}"`,
        `"${w.work}"`,
        `"${w.shift}"`,
        `"${w.salary}"`,
        `"${w.joinDate}"`,
        `"${w.address}"`,
        `"${w.emergencyContact}"`,
        `"${w.idProof}"`,
        `"${w.idNumber}"`,
        `"${w.notes}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factory_workers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const printWorkers = () => {
    if (workers.length === 0) {
      alert('No workers to print!');
      return;
    }
    window.print();
  };

  // Filter workers
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.work.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.phone.includes(searchTerm);
    const matchesGender = !genderFilter || worker.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="App">
      <div className="container">
        <h1>HELI Fabrics - Labor Management System</h1>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'workers' ? 'active' : ''}`}
            onClick={() => setActiveTab('workers')}
          >
            Workers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
          <button 
            className={`tab-btn ${activeTab === 'report' ? 'active' : ''}`}
            onClick={() => setActiveTab('report')}
          >
            Reports
          </button>
          <button 
            className={`tab-btn ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            Worker Calendar
          </button>
        </div>

        {/* Workers Tab */}
        {activeTab === 'workers' && (
          <>
            <WorkerForm onAddWorker={addWorker} />

            <div className="workers-section">
              <h2>All Workers</h2>
              <div className="worker-count">
                Total Workers: {workers.length}
              </div>

              <div className="search-filter-section">
                <input
                  type="text"
                  placeholder="Search by name, work, or phone..."
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="filter-select"
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value)}
                >
                  <option value="">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={exportToCSV} className="export-btn">Export to CSV</button>
                <button onClick={printWorkers} className="export-btn">Print</button>
              </div>

              {loading ? (
                <div className="loading">Loading workers...</div>
              ) : (
                <WorkerList workers={filteredWorkers} onDeleteWorker={deleteWorker} onEditWorker={editWorker} />
              )}
            </div>
          </>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <AttendanceManager workers={workers} />
        )}

        {/* Report Tab */}
        {activeTab === 'report' && (
          <AttendanceReport />
        )}

        {/* Worker Calendar Tab */}
        {activeTab === 'calendar' && (
          <WorkerAttendanceCalendar workers={workers} />
        )}
      </div>
    </div>
  );
}

export default App;
