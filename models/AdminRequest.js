// models/AdminRequest.js
import mongoose from 'mongoose';

const adminRequestSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'approved', 'denied'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const AdminRequest = mongoose.model('AdminRequest', adminRequestSchema);

export default AdminRequest;
