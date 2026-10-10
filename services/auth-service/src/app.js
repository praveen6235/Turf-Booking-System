const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const { errorHandler } = require('./middlewares/errorMiddleware');
const AppError = require('./utils/AppError');
const { metricsMiddleware, getMetricsHandler } = require('./utils/metrics');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(metricsMiddleware('auth-service'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', (req, res) => {
  const isDbReady = mongoose.connection.readyState === 1;
  if (isDbReady) {
    res.status(200).json({ status: 'READY', database: 'connected' });
  } else {
    res.status(503).json({ status: 'NOT_READY', database: 'disconnected' });
  }
});

app.get('/metrics', getMetricsHandler);

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', authRoutes);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on auth-service`, 404));
});

app.use(errorHandler);

module.exports = app;
