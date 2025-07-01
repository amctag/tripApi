// src/services/notificationService.js
const admin = require('firebase-admin');
const path = require('path');
const serviceAccount = require(path.resolve(__dirname, '../../config/firebase/serviceAccountKey.json'));

// Initialize Firebase only once
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL || '' // Add if using Realtime Database
  });
}

const messaging = admin.messaging();

module.exports = {
  /**
   * Send to multiple devices (max 500 per batch)
   * @param {string[]} tokens - Array of FCM device tokens
   * @param {object} payload - Notification content
   * @param {string} payload.title - Notification title
   * @param {string} payload.body - Notification body
   * @param {object} [payload.data] - Additional data payload
   * @returns {Promise<object>} Result object with success status
   */
  async sendBulkNotifications(tokens, { title, body, data = {} }) {
    // Validate input
    if (!tokens || !tokens.length) {
      return {
        success: false,
        error: 'No tokens provided',
        code: 'NO_TOKENS'
      };
    }

    // Limit to 500 tokens per batch (FCM limit)
    const batchLimit = 500;
    const batches = [];
    
    for (let i = 0; i < tokens.length; i += batchLimit) {
      batches.push(tokens.slice(i, i + batchLimit));
    }

    try {
      const results = [];
      
      for (const batch of batches) {
        const message = {
          notification: { title, body },
          data,
          tokens: batch
        };

        const batchResponse = await messaging.sendMulticast(message);
        results.push({
          successCount: batchResponse.successCount,
          failureCount: batchResponse.failureCount,
          responses: batchResponse.responses.map((r, i) => ({
            token: batch[i],
            success: r.success,
            error: r.error
          }))
        });
      }

      return {
        success: true,
        batches: results,
        totalSuccess: results.reduce((sum, r) => sum + r.successCount, 0),
        totalFailure: results.reduce((sum, r) => sum + r.failureCount, 0)
      };

    } catch (error) {
      console.error('FCM Error:', {
        error: error.message,
        code: error.code,
        stack: error.stack
      });

      return {
        success: false,
        error: error.message,
        code: error.code || 'FCM_ERROR'
      };
    }
  },

  /**
   * Helper to clean invalid tokens from database
   * @param {Array} results - Results from sendBulkNotifications
   * @returns {Array} Invalid tokens to remove
   */
  getInvalidTokens(results) {
    const invalidTokens = [];
    
    results.batches?.forEach(batch => {
      batch.responses?.forEach((response, index) => {
        if (!response.success && response.error) {
          invalidTokens.push({
            token: batch.tokens[index],
            error: response.error
          });
        }
      });
    });

    return invalidTokens;
  }
};
