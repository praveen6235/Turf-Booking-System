const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const proxy = require('express-http-proxy');
const { metricsMiddleware, getMetricsHandler } = require('./utils/metrics');

const app = express();

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:5001';
const TURF_SERVICE_URL = process.env.TURF_SERVICE_URL || 'http://turf-service:5002';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://booking-service:5003';

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));

app.use(metricsMiddleware('api-gateway'));

// Health, Ready, Metrics
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'READY', service: 'api-gateway' });
});

app.get('/metrics', getMetricsHandler);

// Reverse Proxy Route Routing
app.use('/api/v1/auth', proxy(AUTH_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/v1/auth${req.url}`
}));

app.use('/api/v1/users', proxy(AUTH_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/v1/users${req.url}`
}));

app.use('/api/v1/turfs', proxy(TURF_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/v1/turfs${req.url}`
}));

app.use('/api/v1/reviews', proxy(TURF_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/v1/reviews${req.url}`
}));

app.use('/api/v1/bookings', proxy(BOOKING_SERVICE_URL, {
  proxyReqPathResolver: req => `/api/v1/bookings${req.url}`
}));

app.use('*', (req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on api-gateway`
  });
});

module.exports = app;
