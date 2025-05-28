// src/api/controllers/userController.js
const userModel = require("../models/userModel");

module.exports = {
  /**
   * Get all users (paginated)
   * @route GET /api/v1/users/
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAllUsers(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const offset = parseInt(req.query.offset) || 0;

      const users = await userModel.getAll(limit, offset);
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Get specific user by ID
   * @route GET /api/v1/users/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getUser(req, res) {
    try {
      const user = await userModel.getById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Update user information
   * @route PATCH /api/v1/users/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateUser(req, res) {
    try {
      // Only allow updating these fields
      const updateData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        profile_picture: req.body.profile_picture,
      };

      const updatedUser = await userModel.update(req.params.id, updateData);
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Soft delete user (requires password verification)
   * @route DELETE /api/v1/users/:id
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async deleteUser(req, res) {
    try {
      const { password, confirm_password } = req.body;

      if (!password || !confirm_password) {
        return res
          .status(400)
          .json({ error: "Password and confirmation are required" });
      }

      if (password !== confirm_password) {
        return res
          .status(400)
          .json({ error: "Password and confirmation do not match" });
      }

      const deletedUser = await userModel.delete(req.params.id, password);
      if (!deletedUser) {
        return res
          .status(404)
          .json({ error: "User not found or password incorrect" });
      }

      res.json({
        message: "User deactivated successfully",
        deleted_at: deletedUser.deleted_at,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
