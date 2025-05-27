// src/api/routes/v1/changePasswordRoute.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const changePasswordController = require('../../controllers/changePasswordController');

// Validation rules
const changePasswordValidation = [
  body('user_id')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be an integer'),

  body('old_password')
    .notEmpty()
    .withMessage('Old password is required'),

  body('new_password')
    .notEmpty()
    .withMessage('New password is required')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long'),

  body('confirm_password')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),

  body().custom((value, { req }) => {
    if (req.body.old_password === req.body.new_password) {
      throw new Error('New password must be different from old password');
    }
    return true;
  })
];

// Route
router.post('/', changePasswordValidation, changePasswordController.changePassword);

module.exports = router;