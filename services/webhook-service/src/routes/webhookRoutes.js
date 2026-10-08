const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

router.post('/github', webhookController.handleGitHubWebhook);

module.exports = router;
