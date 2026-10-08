const client = require('prom-client');

client.collectDefaultMetrics({ prefix: 'turf_service_' });

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
  metricsMiddleware,
  getMetricsHandler
};
