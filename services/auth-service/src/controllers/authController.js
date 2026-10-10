const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { userRegistrationsTotal, loginsTotal, loginFailuresTotal } = require('../utils/metrics');

const signToken = user => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'super_secret_jwt_key_for_turf_booking_system_2026',
    { expiresIn: process.env.JWT_EXPIRES_IN || '90d' }
  );
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || 'Customer',
    phone: req.body.phone
  });

  userRegistrationsTotal.inc({ role: newUser.role });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    loginFailuresTotal.inc({ reason: 'missing_credentials' });
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    loginFailuresTotal.inc({ reason: 'invalid_credentials' });
    return next(new AppError('Incorrect email or password', 401));
  }

  loginsTotal.inc({ method: 'password' });
  createSendToken(user, 200, res);
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Forgot password email sent!'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully!'
  });
});

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = catchAsync(async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) {
    loginFailuresTotal.inc({ reason: 'no_google_credential' });
    return next(new AppError('No credential provided', 400));
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    loginFailuresTotal.inc({ reason: 'invalid_google_token' });
    return next(new AppError('Invalid Google credential', 400));
  }

  const { sub: googleId, email, name } = payload;

  let user = await User.findOne({ email });

  if (user) {
    if (!user.googleId) {
      user.googleId = googleId;
      await user.save({ validateBeforeSave: false });
    }
  } else {
    user = await User.create({
      name,
      email,
      googleId,
      isEmailVerified: true
    });
    userRegistrationsTotal.inc({ role: user.role });
  }

  loginsTotal.inc({ method: 'google' });
  createSendToken(user, 200, res);
});
