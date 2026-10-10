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
    type: String,
    required: [true, 'Review must belong to a user']
  },
  userName: {
    type: String,
    default: 'Customer'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

reviewSchema.index({ turfId: 1, userId: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function(turfId) {
  if (!turfId) return;
  const idStr = turfId.toString();
  const objId = mongoose.Types.ObjectId.isValid(idStr) ? new mongoose.Types.ObjectId(idStr) : idStr;

  const stats = await this.aggregate([
    {
      $match: { turfId: { $in: [objId, idStr] } }
    },
    {
      $group: {
        _id: null,
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Turf').findByIdAndUpdate(turfId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: Math.round(stats[0].avgRating * 10) / 10
    });
  } else {
    await mongoose.model('Turf').findByIdAndUpdate(turfId, {
      ratingsQuantity: 0,
      ratingsAverage: 0
    });
  }
};

reviewSchema.post('save', function() {
  this.constructor.calcAverageRatings(this.turfId);
});

reviewSchema.post(/^findOneAnd/, async function(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.turfId);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
