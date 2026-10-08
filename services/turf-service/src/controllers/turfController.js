const cloudinary = require('cloudinary').v2;
const Turf = require('../models/Turf');
const APIFeatures = require('../utils/APIFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { activeTurfs, turfImageUploadsTotal, cloudinaryUploadDurationSeconds } = require('../utils/metrics');

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

exports.getAllTurfs = catchAsync(async (req, res, next) => {
  const baseQuery = Turf.find({ isApproved: true }).populate('reviews');
  
  const features = new APIFeatures(baseQuery, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
    
  const turfs = await features.query;

  const count = await Turf.countDocuments({ isApproved: true });
  activeTurfs.set(count);

  const updatedTurfs = turfs.map(t => {
    const turfObj = t.toObject ? t.toObject() : t;
    const revs = turfObj.reviews || [];
    const revCount = revs.length || turfObj.ratingsQuantity || 0;
    const avg = revCount > 0 
      ? (revs.length ? Math.round((revs.reduce((sum, r) => sum + r.rating, 0) / revs.length) * 10) / 10 : turfObj.ratingsAverage)
      : 0;

    return {
      ...turfObj,
      ratingsQuantity: revCount,
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
  const revCount = revs.length || turfObj.ratingsQuantity || 0;
  const avg = revCount > 0 
    ? (revs.length ? Math.round((revs.reduce((sum, r) => sum + r.rating, 0) / revs.length) * 10) / 10 : turfObj.ratingsAverage)
    : 0;

  res.status(200).json({
    status: 'success',
    data: {
      turf: {
        ...turfObj,
        ratingsQuantity: revCount,
        ratingsAverage: avg
      }
    }
  });
});

exports.getInternalTurf = catchAsync(async (req, res, next) => {
  const turf = await Turf.findById(req.params.id);
  if (!turf) {
    return next(new AppError('No turf found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      turf: {
        id: turf._id,
        name: turf.name,
        location: turf.location,
        pricePerHour: turf.pricePerHour,
        images: turf.images
      }
    }
  });
});

exports.createTurf = catchAsync(async (req, res, next) => {
  req.body.ownerId = req.user.id;

  // Handle uploaded images to Cloudinary if files are present
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(file => {
      const start = Date.now();
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'turf-booking/turfs' },
          (err, result) => {
            if (err) return reject(err);
            const duration = (Date.now() - start) / 1000;
            cloudinaryUploadDurationSeconds.observe(duration);
            turfImageUploadsTotal.inc();
            resolve(result.secure_url);
          }
        );
        stream.end(file.buffer);
      });
    });

    try {
      req.body.images = await Promise.all(uploadPromises);
    } catch (err) {
      console.warn('Cloudinary upload warning:', err.message);
    }
  }

  const newTurf = await Turf.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      turf: newTurf
    }
  });
});

exports.updateTurf = catchAsync(async (req, res, next) => {
  const turf = await Turf.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );

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
