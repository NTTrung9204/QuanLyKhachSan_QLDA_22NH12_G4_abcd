const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(authMiddleware.protect);

// Profile routes
router.get('/profile', userController.getMyProfile);
router.patch('/profile', userController.updateMyProfile);

module.exports = router; 