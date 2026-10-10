const crypto = require('crypto');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { githubWebhookEventsTotal, githubWebhookErrorsTotal, githubDeploymentEventsTotal } = require('../utils/metrics');

// Constant-time signature verification helper to prevent timing attacks
const verifySignature = (rawBody, signatureHeader, secret) => {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false;
  }
  const signature = signatureHeader.substring(7);
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(rawBody).digest('hex');

  const signatureBuffer = Buffer.from(signature, 'utf8');
  const digestBuffer = Buffer.from(digest, 'utf8');

  if (signatureBuffer.length !== digestBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
};

exports.handleGitHubWebhook = catchAsync(async (req, res, next) => {
  const event = req.headers['x-github-event'];
  const signature = req.headers['x-hub-signature-256'];
  const secret = process.env.GITHUB_WEBHOOK_SECRET || 'super_secret_github_webhook_token_2026';

  // 1. Verify HMAC-SHA256 signature
  const rawBody = req.rawBody || JSON.stringify(req.body);
  const isAuthentic = verifySignature(rawBody, signature, secret);

  if (!isAuthentic) {
    githubWebhookErrorsTotal.inc({ reason: 'invalid_signature' });
    return next(new AppError('Invalid GitHub Webhook Signature', 401));
  }

  const payload = req.body;
  const action = payload.action || 'push';

  // 2. Increment Event Metrics
  githubWebhookEventsTotal.inc({ event: event || 'unknown', action: action });

  console.log(`📌 GitHub Webhook Event Received: [${event}] Action: [${action}]`);

  // 3. Process push or deployment events for Grafana Annotations
  if (event === 'push') {
    const ref = payload.ref;
    const commitSha = payload.after ? payload.after.substring(0, 7) : 'head';
    console.log(`🚀 Push detected on branch ${ref}. Commit SHA: ${commitSha}`);

    githubDeploymentEventsTotal.inc({
      service: 'all-services',
      environment: process.env.NODE_ENV || 'production'
    });
  } else if (event === 'deployment' || event === 'release') {
    const serviceName = payload.repository ? payload.repository.name : 'turf-system';
    githubDeploymentEventsTotal.inc({
      service: serviceName,
      environment: payload.deployment ? payload.deployment.environment : 'production'
    });
  }

  res.status(200).json({
    status: 'success',
    message: 'GitHub webhook processed successfully',
    event,
    action
  });
});
