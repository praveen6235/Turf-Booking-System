const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const webhookRoutes = require('./routes/webhookRoutes');
const AppError = require('./utils/AppError');
const { metricsMiddleware, getMetricsHandler } = require('./utils/metrics');

const app = express();

app.use(helmet());
app.use(cors());

// Capture raw body for constant-time HMAC SHA256 signature verification
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.use(metricsMiddleware('webhook-service'));

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'webhook-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'READY', service: 'webhook-service' });
});

app.get('/metrics', getMetricsHandler);

// Routes
app.use('/webhook', webhookRoutes);
app.use('/api/v1/webhook', webhookRoutes);

app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on webhook-service`, 404));
});

// Global error handler
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message
  });
});

module.exports = app;
