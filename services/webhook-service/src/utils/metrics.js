const client = require('prom-client');

client.collectDefaultMetrics({ prefix: 'turf_webhook_' });

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

const githubWebhookEventsTotal = new client.Counter({
  name: 'github_webhook_events_total',
  help: 'Total number of GitHub webhook events received',
  labelNames: ['event', 'action']
});

const githubWebhookErrorsTotal = new client.Counter({
  name: 'github_webhook_errors_total',
  help: 'Total number of GitHub webhook processing errors',
  labelNames: ['reason']
});

const githubDeploymentEventsTotal = new client.Counter({
  name: 'github_deployment_events_total',
  help: 'Total number of GitHub deployment events processed for Grafana annotations',
  labelNames: ['service', 'environment']
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
  githubWebhookEventsTotal,
  githubWebhookErrorsTotal,
  githubDeploymentEventsTotal,
  metricsMiddleware,
  getMetricsHandler
};
