const Turf = require('../models/Turf');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const syncAllTurfRatings = require('../utils/syncRatings');

exports.getAllTurfs = catchAsync(async (req, res, next) => {
  // Sync ratings across all turfs
  await syncAllTurfRatings();

  // Execute Query using APIFeatures with populated virtual reviews
  const baseQuery = Turf.find({ isApproved: true }).populate('reviews');
  
  const features = new APIFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
  const turfs = await features.query;

  // Compute live rating score & count dynamically for every turf
  const updatedTurfs = turfs.map(t => {
    const turfObj = t.toObject ? t.toObject() : t;
    const revs = turfObj.reviews || [];
    const count = revs.length || turfObj.ratingsQuantity || 0;
    const avg = count > 0 
      ? (revs.length ? Math.round((revs.reduce((sum, r) => sum + r.rating, 0) / revs.length) * 10) / 10 : turfObj.ratingsAverage)
      : 0;

    return {
      ...turfObj,
      ratingsQuantity: count,
      ratingsAverage: avg
    };
  });

  res.status(200).json({
    status: 'success',
    results: updatedTurfs.length,
    data: {
      turfs: updatedTurfs
    }
  });
});

exports.getTurf = catchAsync(async (req, res, next) => {
  const turf = await Turf.findById(req.params.id).populate('reviews');

  if (!turf) {
    return next(new AppError('No turf found with that ID', 404));
  }

  const turfObj = turf.toObject ? turf.toObject() : turf;
  const revs = turfObj.reviews || [];
  const count = revs.length || turfObj.ratingsQuantity || 0;
  const avg = count > 0 
    ? (revs.length ? Math.round((revs.reduce((sum, r) => sum + r.rating, 0) / revs.length) * 10) / 10 : turfObj.ratingsAverage)
    : 0;

  res.status(200).json({
    status: 'success',
    data: {
      turf: {
        ...turfObj,
        ratingsQuantity: count,
        ratingsAverage: avg
      }
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
