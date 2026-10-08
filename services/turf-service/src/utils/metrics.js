const client = require('prom-client');
const mongoose = require('mongoose');

client.collectDefaultMetrics({ prefix: 'turf_service_' });

// 1. RED Metrics
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['service', 'method', 'route', 'status']
});

const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['service', 'method', 'route', 'status'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

// 2. Business Metrics
const activeTurfs = new client.Gauge({
  name: 'active_turfs',
  help: 'Total number of active and approved turfs'
});

const turfImageUploadsTotal = new client.Counter({
  name: 'turf_image_uploads_total',
  help: 'Total number of turf image uploads'
});

const cloudinaryUploadDurationSeconds = new client.Histogram({
  name: 'cloudinary_upload_duration_seconds',
  help: 'Duration of Cloudinary image uploads in seconds',
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

// 3. Dependency Metrics
const cloudinaryErrorsTotal = new client.Counter({
  name: 'cloudinary_errors_total',
  help: 'Total number of Cloudinary upload errors',
  labelNames: ['error_type']
});

const mongodbOperationDurationSeconds = new client.Histogram({
  name: 'mongodb_operation_duration_seconds',
  help: 'Duration of MongoDB operations in seconds',
  labelNames: ['service', 'operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1]
});

const mongodbConnectionState = new client.Gauge({
  name: 'mongodb_connection_state',
  help: 'State of MongoDB connection (1 = connected, 0 = disconnected)',
  labelNames: ['service']
});

setInterval(() => {
  const isConnected = mongoose.connection.readyState === 1 ? 1 : 0;
  mongodbConnectionState.set({ service: 'turf-service' }, isConnected);
}, 10000);

const metricsMiddleware = (serviceName) => {
  return (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = (Date.now() - start) / 1000;
      const route = req.route ? req.route.path : req.path;
      const labels = {
        service: serviceName,
        method: req.method,
        route: route || req.path,
        status: res.statusCode.toString()
      };
      httpRequestsTotal.inc(labels);
      httpRequestDurationSeconds.observe(labels, duration);
    });
    next();
  };
};

const getMetricsHandler = async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
};

module.exports = {
  client,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  activeTurfs,
  turfImageUploadsTotal,
  cloudinaryUploadDurationSeconds,
  cloudinaryErrorsTotal,
  mongodbOperationDurationSeconds,
  mongodbConnectionState,
  metricsMiddleware,
  getMetricsHandler
};
