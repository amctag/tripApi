// src/services/notificationService.js
const admin = require('firebase-admin');
// ... (keep your existing Firebase initialization code) ...

module.exports = {
  // ... existing sendNotification() ...

  /**
   * Send to multiple devices (max 500 per batch)
   * @param {string[]} tokens - Array of device tokens
   * @param {object} payload - {title, body, data?}
   */
  async sendBulkNotifications(tokens, { title, body, data = {} }) {
    try {
      const message = {
        notification: { title, body },
        data,
        tokens // Array of device tokens
      };

      const response = await admin.messaging().sendMulticast(message);
      return {
        success: true,
        successCount: response.successCount,
        failureCount: response.failureCount,
        results: response.responses
      };
    } catch (error) {
      console.error('Bulk FCM Error:', error);
      return { success: false, error: error.message };
    }
  }
};