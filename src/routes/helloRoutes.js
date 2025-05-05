const express = require('express');
const helloController = require('../controllers/helloController');
const { optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Hello world route with optional authentication
router.get('/', optionalAuth, helloController.getHello);

module.exports = router; 