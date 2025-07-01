// src/routes/v1/notificationRoute.js
const express = require('express');
const router = express.Router();
const controller = require('../../controllers/notificationController');

router.post('/send/:tokenId', controller.send); // Existing
router.post('/broadcast', controller.sendToAll); // New route

module.exports = router;