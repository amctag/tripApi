// src/controllers/notificationController.js
const notificationService = require('../services/notificationService');
const tokenModel = require('../models/tokenModel');

module.exports = {
  // ... existing send() method ...

  /**
   * Send "Hello" to all devices
   */
  async sendToAll(req, res) {
    try {
      // 1. Get all tokens from DB
      const tokens = await tokenModel.getAllTokens();
      if (tokens.length === 0) {
        return res.status(404).json({ error: "No tokens found" });
      }

      // 2. Extract just the token strings
      const deviceTokens = tokens.map(t => t.token);

      // 3. Send static message
      const result = await notificationService.sendBulkNotifications(
        deviceTokens,
        {
          title: "Hello",
          body: "This is a broadcast message to all devices"
        }
      );

      if (!result.success) {
        return res.status(400).json(result);
      }

      res.json({
        success: true,
        sentTo: result.successCount + " devices",
        failed: result.failureCount + " devices"
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  }
};