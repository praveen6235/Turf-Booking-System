const Review = require('../models/Review');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.turfId) filter = { turfId: req.params.turfId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // Allow nested routes
  if (!req.body.turfId) req.body.turfId = req.params.turfId;
  if (!req.body.userId) req.body.userId = req.user.id;

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
