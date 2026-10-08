const client = require('prom-client');

client.collectDefaultMetrics({ prefix: 'turf_booking_' });

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
  metricsMiddleware,
  getMetricsHandler
};
