const express = require('express');
const { eventsHandler } = require('../controllers/eventsController');

const router = express.Router();

// SSE endpoint
router.get('/', eventsHandler);

module.exports = router;