import React from 'react';

function WorkerCard({ worker, onDelete }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="worker-card">
      <img
        className="worker-photo"
        src={worker.photo || 'https://via.placeholder.com/300x200/667eea/ffffff?text=No+Photo'}
        alt={worker.name}
      />
      <div className="worker-info">
        <h3>{worker.name}</h3>
        
        <div className="info-item">
          <span className="info-label">Gender:</span>
          <span className="info-value">{worker.gender}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Phone:</span>
          <span className="info-value">{worker.phone}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Reference:</span>
          <span className="info-value">{worker.reference}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Work:</span>
          <span className="info-value">{worker.work}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Shift:</span>
          <span className="info-value">{worker.shift}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Salary:</span>
          <span className="info-value">₹{worker.salary}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Joined:</span>
          <span className="info-value">{formatDate(worker.joinDate)}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Address:</span>
          <span className="info-value">{worker.address}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">Emergency:</span>
          <span className="info-value">{worker.emergencyContact}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">ID Proof:</span>
          <span className="info-value">{worker.idProof}</span>
        </div>
        
        <div className="info-item">
          <span className="info-label">ID Number:</span>
          <span className="info-value">{worker.idNumber}</span>
        </div>
        
        {worker.notes && worker.notes !== 'None' && (
          <div className="info-item">
            <span className="info-label">Notes:</span>
            <span className="info-value">{worker.notes}</span>
          </div>
        )}
        
        <button className="delete-btn" onClick={onDelete}>
          🗑️ Delete Worker
        </button>
      </div>
    </div>
  );
}

export default WorkerCard;
