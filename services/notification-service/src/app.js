const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const sendEmail = require('./utils/email');
const {
  metricsMiddleware,
  getMetricsHandler,
  errorHandler,
  catchAsync,
  AppError
} = require('@turf-booking/common');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(metricsMiddleware('notification-service'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'notification-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', getMetricsHandler);

app.post('/api/v1/notifications/send', catchAsync(async (req, res, next) => {
  const { email, subject, message } = req.body;
  if (!email || !subject || !message) {
    return next(new AppError('Please provide email, subject, and message', 400));
  }

  await sendEmail({ email, subject, message });

  res.status(200).json({
    status: 'success',
    message: 'Notification sent successfully'
  });
}));

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on notification-service`, 404));
});

app.use(errorHandler);

module.exports = app;
