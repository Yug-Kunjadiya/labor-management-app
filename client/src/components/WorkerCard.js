import React, { useState } from 'react';

function WorkerCard({ worker, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(worker.photo);
  const [photoScale, setPhotoScale] = useState(100);
  const [editData, setEditData] = useState({
    name: worker.name,
    phone: worker.phone,
    gender: worker.gender,
    joinDate: worker.joinDate,
    work: worker.work,
    address: worker.address,
    salary: worker.salary,
    shift: worker.shift,
    reference: worker.reference,
    emergencyContact: worker.emergencyContact,
    idProof: worker.idProof,
    idNumber: worker.idNumber,
    notes: worker.notes,
    photo: worker.photo
  });
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    // Validate Aadhar number if editing ID number and ID proof is Aadhar
    if (name === 'idNumber' && editData.idProof === 'Aadhar Card') {
      if (value && !/^\d*$/.test(value)) return;
      if (value.length > 12) return;
    }
    
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Photo size should be less than 5MB');
        e.target.value = '';
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // Directly save the photo without opening editor
        setPhotoPreview(reader.result);
        setEditData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview('');
    setEditData(prev => ({
      ...prev,
      photo: ''
    }));
    // Reset file input
    const fileInput = document.querySelector('input[type="file"][name="photo"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSave = () => {
    const workerId = worker._id || worker.id;
    onEdit(workerId, editData);
    // Reset to view mode
    setIsEditing(false);
    // Reset photo preview to saved photo
    setPhotoPreview(editData.photo);
  };

  const handleCancel = () => {
    setEditData({
      name: worker.name,
      phone: worker.phone,
      gender: worker.gender,
      joinDate: worker.joinDate,
      work: worker.work,
      address: worker.address,
      salary: worker.salary,
      shift: worker.shift,
      reference: worker.reference,
      emergencyContact: worker.emergencyContact,
      idProof: worker.idProof,
      idNumber: worker.idNumber,
      notes: worker.notes,
      photo: worker.photo
    });
    setPhotoPreview(worker.photo);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="worker-card editing">
        <div className="worker-info">
          <h3>Editing Worker</h3>
          
          <div className="edit-form">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <select name="gender" value={editData.gender} onChange={handleEditChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Work/Position:</label>
              <input
                type="text"
                name="work"
                value={editData.work}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Salary:</label>
              <input
                type="text"
                name="salary"
                value={editData.salary}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Shift:</label>
              <select name="shift" value={editData.shift} onChange={handleEditChange}>
                <option value="">Select Shift</option>
                <option value="Day Shift 1">Day Shift (8 AM - 7 PM)</option>
                <option value="Day Shift 2">Day Shift (7 AM - 7 PM)</option>
                <option value="Night Shift 1">Night Shift (7 PM - 8 AM)</option>
                <option value="Night Shift 2">Night Shift (7 PM - 7 AM)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Reference:</label>
              <input
                type="text"
                name="reference"
                value={editData.reference}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Emergency Contact:</label>
              <input
                type="tel"
                name="emergencyContact"
                value={editData.emergencyContact}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>ID Proof:</label>
              <select name="idProof" value={editData.idProof} onChange={handleEditChange}>
                <option value="">Select ID Proof</option>
                <option value="Aadhar Card">Aadhar Card</option>
                <option value="Voter ID">Voter ID</option>
                <option value="PAN Card">PAN Card</option>
                <option value="Driving License">Driving License</option>
              </select>
            </div>

            <div className="form-group">
              <label>{editData.idProof === 'Aadhar Card' ? 'Aadhar Number (12 digits)' : 'ID Number'}:</label>
              <input
                type="text"
                name="idNumber"
                value={editData.idNumber}
                onChange={handleEditChange}
              />
            </div>

            <div className="form-group">
              <label>Address:</label>
              <textarea
                name="address"
                value={editData.address}
                onChange={handleEditChange}
                rows="3"
              ></textarea>
            </div>

            <div className="form-group">
              <label>Notes:</label>
              <textarea
                name="notes"
                value={editData.notes}
                onChange={handleEditChange}
                rows="2"
              ></textarea>
            </div>

            <div className="form-group photo-upload-group">
              <label>Worker Photo:</label>
              <div className="photo-edit-section">
                {photoPreview && (
                  <div className="photo-preview-edit">
                    <img 
                      src={photoPreview} 
                      alt="Worker" 
                      style={{ transform: `scale(${photoScale / 100})` }}
                    />
                  </div>
                )}
                {photoPreview && (
                  <div className="photo-scale-control">
                    <label>Photo Size: {photoScale}%</label>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={photoScale}
                      onChange={(e) => setPhotoScale(Number(e.target.value))}
                      className="photo-scale-slider"
                    />
                  </div>
                )}
                <div className="photo-buttons">
                  <label htmlFor="edit-photo-upload" className="upload-photo-label">
                    {photoPreview ? '📷 Change Photo' : '📷 Upload Photo'}
                  </label>
                  <input
                    type="file"
                    id="edit-photo-upload"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    style={{ display: 'none' }}
                  />
                  {photoPreview && (
                    <button 
                      type="button" 
                      className="remove-photo-btn-small" 
                      onClick={handleRemovePhoto}
                    >
                      🗑️ Remove Photo
                    </button>
                  )}
                </div>
                <small className="photo-hint">Max 5MB. Square images work best</small>
              </div>
            </div>

            <div className="edit-actions">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="worker-card">
      <div className="photo-container">
        {worker.photo ? (
          <img
            className="worker-photo"
            src={worker.photo}
            alt={worker.name}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className="worker-photo" 
          style={{ 
            display: worker.photo ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            color: '#a0aec0'
          }}
        >
          No Photo
        </div>
      </div>
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
        
        <div className="worker-actions">
          <button className="edit-btn" onClick={() => setIsEditing(true)}>
            Edit Worker
          </button>
          <button className="delete-btn" onClick={onDelete}>
            Delete Worker
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkerCard;
