const mongoose = require('mongoose');

const turfSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A turf must have a name'],
    trim: true,
  },
  ownerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A turf must belong to an owner']
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A turf must have a description']
  },
  location: {
    address: String,
    city: String,
    state: String,
    zip: String,
    coordinates: [Number] // [longitude, latitude] for geospatial queries later if needed
  },
  pricePerHour: {
    type: Number,
    required: [true, 'A turf must have a price per hour']
  },
  images: [String],
  amenities: [String],
  sports: [String],
  isApproved: {
    type: Boolean,
    default: false // Admin must approve before it goes live
  },
  ratingsAverage: {
    type: Number,
    default: 0,
    min: [0, 'Rating must be above or equal to 0'],
    max: [5, 'Rating must be below or equal to 5.0'],
    set: val => Math.round(val * 10) / 10
  },
  ratingsQuantity: {
    type: Number,
    default: 0
  }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Virtual populate for reviews
turfSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'turfId',
  localField: '_id'
});

const Turf = mongoose.model('Turf', turfSchema);
module.exports = Turf;
