import React, { useState } from 'react';

function WorkerForm({ onAddWorker }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '',
    joinDate: '',
    work: '',
    address: '',
    salary: '',
    shift: '',
    reference: '',
    emergencyContact: '',
    idProof: '',
    idNumber: '',
    notes: '',
    photo: ''
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [idNumberLabel, setIdNumberLabel] = useState('ID Number');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Update ID number label based on ID proof type
    if (name === 'idProof') {
      switch(value) {
        case 'Aadhar Card':
          setIdNumberLabel('Aadhar Number');
          break;
        case 'Voter ID':
          setIdNumberLabel('Voter ID Number');
          break;
        case 'PAN Card':
          setIdNumberLabel('PAN Number');
          break;
        case 'Driving License':
          setIdNumberLabel('License Number');
          break;
        default:
          setIdNumberLabel('ID Number');
      }
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setFormData(prev => ({
          ...prev,
          photo: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddWorker(formData);
    
    // Reset form
    setFormData({
      name: '',
      phone: '',
      gender: '',
      joinDate: '',
      work: '',
      address: '',
      salary: '',
      shift: '',
      reference: '',
      emergencyContact: '',
      idProof: '',
      idNumber: '',
      notes: '',
      photo: ''
    });
    setPhotoPreview('');
    setIdNumberLabel('ID Number');
  };

  return (
    <div className="add-worker-section">
      <h2>➕ Add New Worker</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Worker Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender *</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Joining Date *</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Work/Position *</label>
            <input
              type="text"
              name="work"
              value={formData.work}
              onChange={handleChange}
              placeholder="e.g., Machine Operator, Supervisor"
              required
            />
          </div>

          <div className="form-group">
            <label>Salary (Monthly)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              placeholder="e.g., 15000"
            />
          </div>

          <div className="form-group">
            <label>Work Shift</label>
            <select name="shift" value={formData.shift} onChange={handleChange}>
              <option value="">Select Shift</option>
              <option value="Morning">Morning (6 AM - 2 PM)</option>
              <option value="Evening">Evening (2 PM - 10 PM)</option>
              <option value="Night">Night (10 PM - 6 AM)</option>
              <option value="General">General (9 AM - 6 PM)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Reference/Referred By</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              placeholder="Who referred this worker?"
            />
          </div>

          <div className="form-group">
            <label>Emergency Contact</label>
            <input
              type="tel"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Emergency phone number"
            />
          </div>

          <div className="form-group">
            <label>ID Proof Type</label>
            <select name="idProof" value={formData.idProof} onChange={handleChange}>
              <option value="">Select ID Proof</option>
              <option value="Aadhar Card">Aadhar Card</option>
              <option value="Voter ID">Voter ID</option>
              <option value="PAN Card">PAN Card</option>
              <option value="Driving License">Driving License</option>
            </select>
          </div>

          <div className="form-group">
            <label>{idNumberLabel}</label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              placeholder="Enter ID number"
            />
          </div>

          <div className="form-group">
            <label>Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
            />
            {photoPreview && (
              <div className="photo-preview">
                <img src={photoPreview} alt="Preview" />
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Address *</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label>Additional Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional information..."
          ></textarea>
        </div>

        <button type="submit" className="btn">Add Worker</button>
      </form>
    </div>
  );
}

export default WorkerForm;
