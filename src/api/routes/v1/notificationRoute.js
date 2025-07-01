// src/api/routes/v1/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationController');

// Send test broadcast
router.post('/notifications/broadcast', notificationController.sendTestBroadcast);

module.exports = router;
