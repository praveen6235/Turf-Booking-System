const client = require('prom-client');

client.collectDefaultMetrics({ prefix: 'turf_auth_' });

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
  metricsMiddleware,
  getMetricsHandler
};
