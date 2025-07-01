// src/api/controllers/notificationController.js
const notificationService = require('../services/notificationService');

module.exports = {
  /**
   * Send a test broadcast notification
   * @param {object} req - Express request object
   * @param {object} res - Express response object
   */
  async sendTestBroadcast(req, res) {
    try {
      const result = await notificationService.sendBroadcast('Hello');
      
      res.json({
        success: true,
        message: 'Broadcast sent successfully',
        data: result
      });
    } catch (error) {
      console.error('Error in sendTestBroadcast:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to send broadcast'
      });
    }
  }
};
