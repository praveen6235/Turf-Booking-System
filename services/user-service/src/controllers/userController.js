const UserProfile = require('../models/User');
const { catchAsync, AppError } = require('@turf-booking/common');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await UserProfile.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: { users }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id || req.user.id;
  const user = await UserProfile.findById(userId);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const userId = req.params.id || req.user.id;
  const updatedUser = await UserProfile.findByIdAndUpdate(userId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedUser) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user: updatedUser }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await UserProfile.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null
  });
});
