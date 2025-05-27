// src/api/controllers/changePasswordController.js
const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

const changePasswordController = {
  async changePassword(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { user_id, old_password, new_password } = req.body;

      // Get user by ID
      const user = await userModel.getById(user_id);

      // Check if user exists
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Verify old password (plain text comparison as in your login)
      if (user.password !== old_password) {
        return res.status(401).json({ error: "Old password is incorrect" });
      }

      // Update password in database
      await userModel.updatePassword(user_id, new_password);

      return res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Change password error:", error);
      return res.status(500).json({ error: "Password change failed" });
    }
  },
};

module.exports = changePasswordController;