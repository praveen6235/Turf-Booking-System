const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
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
    role: req.body.role, // Temporarily allow setting role for testing
    phone: req.body.phone
  });

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: { user }
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Forgot password email sent! (Implementation requires crypto token generation)'
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    message: 'Password reset successfully! (Implementation requires token verification)'
  });
});

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.googleAuth = catchAsync(async (req, res, next) => {
  const { credential } = req.body;
  if (!credential) {
    return next(new AppError('No credential provided', 400));
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

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
  }

  createSendToken(user, 200, res);
});
