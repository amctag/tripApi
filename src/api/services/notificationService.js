// src/services/notificationService.js
const admin = require('firebase-admin');
const path = require('path');
const tokenModel = require('../api/models/tokenModel');

// Initialize Firebase
const serviceAccount = require(path.join(__dirname, '../../config/firebase/serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = {
  /**
   * Send a broadcast notification to all registered devices
   * @param {string} message - The message to send
   * @returns {Promise<object>} Response from FCM
   */
  async sendBroadcast(message) {
    try {
      // Get all tokens from the database
      const tokens = await tokenModel.getAll();
      
      if (!tokens || tokens.length === 0) {
        throw new Error('No registered devices to send notifications to');
      }

      // Extract just the token strings
      const registrationTokens = tokens.map(t => t.token);

      // Send the message
      const response = await admin.messaging().sendMulticast({
        tokens: registrationTokens,
        notification: {
          title: 'Broadcast Message',
          body: message
        }
      });

      return {
        successCount: response.successCount,
        failureCount: response.failureCount,
        responses: response.responses
      };
    } catch (error) {
      console.error('Error sending broadcast:', error);
      throw error;
    }
  }
};
