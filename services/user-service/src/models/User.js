const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ['Customer', 'Owner', 'Admin'], default: 'Customer' },
  phone: String,
  avatar: String,
  isEmailVerified: { type: Boolean, default: false }
}, { timestamps: true });

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;
