const AppError = require('./src/AppError');
const catchAsync = require('./src/catchAsync');
const { errorHandler } = require('./src/errorMiddleware');
const { protect, restrictTo } = require('./src/authMiddleware');
const {
  client,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  metricsMiddleware,
  getMetricsHandler
} = require('./src/metrics');

module.exports = {
  AppError,
  catchAsync,
  errorHandler,
  protect,
  restrictTo,
  prometheusClient: client,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  metricsMiddleware,
  getMetricsHandler
};
