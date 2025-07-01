// src/api/models/tokenModel.js
const db = require("../../config/db");

module.exports = {
  /**
   * Get token by ID
   * @param {number} id - Token ID
   * @returns {Promise<object|null>} Token object or null if not found
   */
  async getById(id) {
    const { rows } = await db.query(
      `SELECT id, token, created_at 
       FROM tokens 
       WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Get latest token (most recently created)
   * @returns {Promise<object|null>} Latest token object or null if table is empty
   */
  async getLatest() {
    const { rows } = await db.query(
      `SELECT id, token, created_at 
       FROM tokens 
       ORDER BY created_at DESC 
       LIMIT 1`
    );
    return rows[0] || null;
  },

  /**
   * Get token by exact token value
   * @param {string} token - The token string to search for
   * @returns {Promise<object|null>} Token object or null if not found
   */
  async getByToken(token) {
    const { rows } = await db.query(
      `SELECT id, token, created_at 
       FROM tokens 
       WHERE token = $1`,
      [token]
    );
    return rows[0] || null;
  },

  async getAll() {
    const { rows } = await db.query(
      'SELECT id, token FROM tokens'
    );
    return rows;
  },

};