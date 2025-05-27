const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const authController = require("../../controllers/registerController");

// Validation rules
const registerValidation = [
  // body('username')
  //   .notEmpty().withMessage('Username is required')
  //   .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    // .withMessage("Password must contain at least one uppercase, one lowercase, one number and one special character")
    ,
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters"),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters"),
  body("country_code") // Added new validation
    .notEmpty()
    .withMessage("Country code is required")
    .isLength({ min: 1, max: 10 })
    .withMessage("Country code must be between 1-10 characters")
    .matches(/^\+?\d+$/)
    .withMessage("Country code must contain only numbers and optional + sign"),
  body("phone_number")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 6 })
    .withMessage("Phone number must be at least 6 characters")
    .isMobilePhone()
    .withMessage("Invalid phone number format"),
  body("profile_picture").optional().isString(),
  body("cover_picture").optional().isString(),
  body("birth_date").optional().isDate(),
  body("gender").optional().isString(),
  body("bio").optional().isString(),
];

// Routes
router.post("/", registerValidation, authController.register);

module.exports = router;
