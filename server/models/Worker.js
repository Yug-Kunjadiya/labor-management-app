const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Other']
    },
    joinDate: {
        type: String,
        required: true
    },
    work: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    salary: {
        type: String,
        default: 'Not specified'
    },
    shift: {
        type: String,
        default: 'Not specified'
    },
    reference: {
        type: String,
        default: 'Not provided'
    },
    emergencyContact: {
        type: String,
        default: 'Not provided'
    },
    idProof: {
        type: String,
        default: 'Not provided'
    },
    idNumber: {
        type: String,
        default: 'Not provided'
    },
    notes: {
        type: String,
        default: 'None'
    },
    photo: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Worker', workerSchema);
