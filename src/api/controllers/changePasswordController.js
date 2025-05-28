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

      // Verify old password using the new dedicated method
      const isPasswordCorrect = await userModel.verifyPassword(user_id, old_password);
      
      if (!isPasswordCorrect) {
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
