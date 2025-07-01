// src/api/controllers/tokenController.js
const tokenModel = require("../models/tokenModel");

module.exports = {
  /**
   * Get all tokens (basic info only)
   * @route GET /api/v1/tokens/
   * @returns {Array} Array of token objects with id and token values
   */
  async getTokens(req, res) {
    try {
      const tokens = await tokenModel.getAll();
      res.json(tokens.map(t => ({ id: t.id, token: t.token })));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get specific token by ID
   * @route GET /api/v1/tokens/:id
   * @returns {Object} Token object with id and token value
   */
  async getToken(req, res) {
    try {
      const token = await tokenModel.getById(req.params.id);
      if (!token) {
        return res.status(404).json({ error: "Token not found" });
      }
      res.json({ id: token.id, token: token.token });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};