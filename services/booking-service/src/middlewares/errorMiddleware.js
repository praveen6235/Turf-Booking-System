const AppError = require('../utils/AppError');
const { bookingConflictsTotal } = require('../utils/metrics');

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (err.code === 11000) {
    bookingConflictsTotal.inc();
    err = new AppError('This time slot is already booked! Please select a different time slot.', 400);
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
