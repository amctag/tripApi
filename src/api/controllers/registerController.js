const userModel = require("../models/userModel");
const { validationResult } = require("express-validator");

const registerController = {
  async register(req, res) {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      // username,
      email,
      password,
      first_name,
      last_name,
      country_code,  // Added new field
      phone_number,
      profile_picture
    } = req.body;

    try {
      // Check if email already exists
      const emailExists = await userModel.getByEmail(email);
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // Check if username already exists
      // const usernameExists = await userModel.getByUsername(username);
      // if (usernameExists) {
      //   return res.status(400).json({ error: "Username already exists" });
      // }

      // Create new user
      const newUser = await userModel.create({
        // username,
        email,
        password, // Hash password? lOl
        first_name,
        last_name,
        country_code,  // Added new field
        phone_number,
        profile_picture
      });

      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
      });
    } catch (error) {
  console.error("Registration error:", error.message, error.stack);
  return res.status(500).json({ 
    error: "Failed to create user, please try again.",
    details: error.message // Include this only in development
  });
}
  },
};

module.exports = registerController;
