const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!']
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [
      function(val) {
        return validator.isEmail(val) && val.toLowerCase().endsWith('@gmail.com');
      },
      'Only @gmail.com emails are allowed'
    ]
  },
  role: {
    type: String,
    enum: ['Customer', 'Owner', 'Admin'],
    default: 'Customer'
  },
  password: {
    type: String,
    required: [
      function () {
        return !this.googleId;
      },
      'Please provide a password',
    ],
    minlength: 8,
    select: false // Never show password in outputs
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  phone: {
    type: String
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to compare passwords
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
