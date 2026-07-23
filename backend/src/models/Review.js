const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review cannot be empty!']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating between 1 and 5']
  },
  turfId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Turf',
    required: [true, 'Review must belong to a turf.']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent user from submitting multiple reviews for the same turf
reviewSchema.index({ turfId: 1, userId: 1 }, { unique: true });

// Auto-populate user details when querying reviews
reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'userId',
    select: 'name avatar' // Assuming we add avatar later
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
