const { upload, cloudinary } = require('../middlewares/uploadMiddleware');
const { catchAsync, AppError } = require('@turf-booking/common');

exports.uploadImages = catchAsync(async (req, res, next) => {
  if (!req.files && !req.file) {
    return next(new AppError('No files uploaded', 400));
  }

  const files = req.files || [req.file];
  const imageUrls = files.map(file => file.path || file.secure_url);

  res.status(200).json({
    status: 'success',
    data: {
      urls: imageUrls
    }
  });
});

exports.deleteImage = catchAsync(async (req, res, next) => {
  const { publicId } = req.params;
  if (!publicId) {
    return next(new AppError('Please provide a valid publicId', 400));
  }

  await cloudinary.uploader.destroy(publicId);

  res.status(200).json({
    status: 'success',
    message: 'Image deleted successfully'
  });
});
