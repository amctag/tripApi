// src/api/routes/v1/tokensRoute.js
const express = require('express');
const router = express.Router();
const tokenController = require('../../controllers/tokenController');

// Routes
router.get('/', tokenController.getTokens);
router.get('/:id', tokenController.getToken);

module.exports = router;