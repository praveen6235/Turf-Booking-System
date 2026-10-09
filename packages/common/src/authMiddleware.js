const jwt = require('jsonwebtoken');
const AppError = require('./AppError');
const catchAsync = require('./catchAsync');

/**
 * Protect middleware:
 * 1) Checks for edge-injected headers (x-user-id, x-user-role) from api-gateway
 * 2) Falls back to verifying JWT token directly if request arrives with Bearer token
 */
const protect = catchAsync(async (req, res, next) => {
  // Option A: Edge Gateway has already validated JWT and injected headers
  if (req.headers['x-user-id']) {
    req.user = {
      id: req.headers['x-user-id'],
      role: req.headers['x-user-role'] || 'Customer',
      email: req.headers['x-user-email'] || ''
    };
    return next();
  }

  // Option B: Verify Bearer token directly
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
  req.user = {
    id: decoded.id,
    role: decoded.role || 'Customer',
    email: decoded.email || ''
  };

  next();
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

module.exports = {
  protect,
  restrictTo
};
