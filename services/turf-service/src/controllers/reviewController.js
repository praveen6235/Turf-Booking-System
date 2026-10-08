const mongoose = require('mongoose');
const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.turfId) filter = { turfId: req.params.turfId };

  const reviews = await Review.find(filter).sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ userId: req.user.id })
    .populate('turfId', 'name location images')
    .sort('-createdAt');

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  const turfId = req.body.turfId || req.params.turfId;
  const userId = req.user.id;

  if (!turfId) {
    return next(new AppError('Review must belong to a turf.', 400));
  }

  const turfObjId = mongoose.Types.ObjectId.isValid(turfId) ? new mongoose.Types.ObjectId(turfId) : turfId;

  const review = await Review.findOneAndUpdate(
    { turfId: turfObjId, userId: userId },
    {
      turfId: turfObjId,
      userId: userId,
      rating: req.body.rating,
      review: req.body.review
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    }
  ).populate('turfId', 'name location images');

  await Review.calcAverageRatings(turfObjId);

  res.status(200).json({
    status: 'success',
    data: {
      review
    }
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findOneAndDelete({
    _id: req.params.id,
    $or: [{ userId: req.user.id }, { role: 'Admin' }]
  });

  if (!review) {
    return next(new AppError('No review found with that ID or you do not have permission to delete it', 404));
  }

  await Review.calcAverageRatings(review.turfId);

  res.status(204).json({
    status: 'success',
    data: null
  });
});
