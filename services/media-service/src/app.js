const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mediaRoutes = require('./routes/mediaRoutes');
const {
  metricsMiddleware,
  getMetricsHandler,
  errorHandler,
  AppError
} = require('@turf-booking/common');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(metricsMiddleware('media-service'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'media-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', getMetricsHandler);

app.use('/api/v1/media', mediaRoutes);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on media-service`, 404));
});

app.use(errorHandler);

module.exports = app;
