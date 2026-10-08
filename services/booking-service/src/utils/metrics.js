const client = require('prom-client');
const mongoose = require('mongoose');

client.collectDefaultMetrics({ prefix: 'turf_booking_' });

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
const turfBookingsCreatedTotal = new client.Counter({
  name: 'turf_bookings_created_total',
  help: 'Total number of bookings successfully created',
  labelNames: ['status']
});

const bookingFailuresTotal = new client.Counter({
  name: 'booking_failures_total',
  help: 'Total number of booking failures',
  labelNames: ['reason']
});

const bookingConflictsTotal = new client.Counter({
  name: 'booking_conflicts_total',
  help: 'Total number of double-booking slot conflicts prevented'
});

// 3. Dependency Metrics
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
  mongodbConnectionState.set({ service: 'booking-service' }, isConnected);
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
  turfBookingsCreatedTotal,
  bookingFailuresTotal,
  bookingConflictsTotal,
  mongodbOperationDurationSeconds,
  mongodbConnectionState,
  metricsMiddleware,
  getMetricsHandler
};
