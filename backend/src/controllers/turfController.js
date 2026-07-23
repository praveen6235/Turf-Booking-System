const Turf = require('../models/Turf');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllTurfs = catchAsync(async (req, res, next) => {
  // Execute Query using APIFeatures
  // Start with a base query that only shows approved turfs
  const baseQuery = Turf.find({ isApproved: true });
  
  const features = new APIFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
  const turfs = await features.query;

  res.status(200).json({
    status: 'success',
    results: turfs.length,
    data: {
      turfs
    }
  });
});

exports.getTurf = catchAsync(async (req, res, next) => {
  const turf = await Turf.findById(req.params.id);

  if (!turf) {
    return next(new AppError('No turf found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      turf
    }
  });
});

exports.createTurf = catchAsync(async (req, res, next) => {
  // Add current owner ID to body
  req.body.ownerId = req.user.id;
  
  const newTurf = await Turf.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      turf: newTurf
    }
  });
});

exports.updateTurf = catchAsync(async (req, res, next) => {
  const turf = await Turf.findOneAndUpdate({ _id: req.params.id, ownerId: req.user.id }, req.body, {
    new: true,
    runValidators: true
  });

  if (!turf) {
    return next(new AppError('No turf found or you do not have permission to update it', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      turf
    }
  });
});

exports.deleteTurf = catchAsync(async (req, res, next) => {
  const turf = await Turf.findOneAndDelete({ _id: req.params.id, ownerId: req.user.id });

  if (!turf) {
    return next(new AppError('No turf found or you do not have permission to delete it', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
});
