const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const userRoutes = require('./routes/userRoutes');
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

app.use(metricsMiddleware('user-service'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', getMetricsHandler);

app.use('/api/v1/users', userRoutes);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on user-service`, 404));
});

app.use(errorHandler);

module.exports = app;
