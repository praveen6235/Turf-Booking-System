const client = require('prom-client');

// Enable default metrics collection (CPU, memory, loop lag, GC, etc.)
client.collectDefaultMetrics({ timeout: 5000 });

// Global Counter for HTTP requests total per service
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests processed by microservice',
  labelNames: ['service', 'method', 'route', 'status_code']
});

// Global Histogram for HTTP request duration in seconds
const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['service', 'method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10]
});

/**
 * Express middleware to automatically track request metrics
 */
const metricsMiddleware = (serviceName) => {
  return (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
      const duration = process.hrtime(start);
      const durationInSeconds = duration[0] + duration[1] / 1e9;
      const route = req.route ? req.route.path : req.path || 'unknown';

      httpRequestsTotal.inc({
        service: serviceName,
        method: req.method,
        route,
        status_code: res.statusCode
      });

      httpRequestDurationSeconds.observe(
        {
          service: serviceName,
          method: req.method,
          route,
          status_code: res.statusCode
        },
        durationInSeconds
      );
    });

    next();
  };
};

/**
 * Handler for /metrics endpoint
 */
const getMetricsHandler = async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  const metrics = await client.register.metrics();
  res.end(metrics);
};

module.exports = {
  client,
  httpRequestsTotal,
  httpRequestDurationSeconds,
  metricsMiddleware,
  getMetricsHandler
};
