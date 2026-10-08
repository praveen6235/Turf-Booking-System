const client = require('prom-client');
const mongoose = require('mongoose');

client.collectDefaultMetrics({ prefix: 'turf_auth_' });

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
const userRegistrationsTotal = new client.Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations',
  labelNames: ['role']
});

const loginsTotal = new client.Counter({
  name: 'logins_total',
  help: 'Total number of successful user logins',
  labelNames: ['method']
});

const loginFailuresTotal = new client.Counter({
  name: 'login_failures_total',
  help: 'Total number of failed user logins',
  labelNames: ['reason']
});

// 3. Dependency Metrics
const googleOauthErrorsTotal = new client.Counter({
  name: 'google_oauth_errors_total',
  help: 'Total number of Google OAuth verification errors',
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

// Monitor MongoDB connection state every 10 seconds
setInterval(() => {
  const isConnected = mongoose.connection.readyState === 1 ? 1 : 0;
  mongodbConnectionState.set({ service: 'auth-service' }, isConnected);
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
  userRegistrationsTotal,
  loginsTotal,
  loginFailuresTotal,
  googleOauthErrorsTotal,
  mongodbOperationDurationSeconds,
  mongodbConnectionState,
  metricsMiddleware,
  getMetricsHandler
};
