const express = require('express');
const authController = require('../controllers/authController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Authentication routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Protected routes
router.post('/logout', protect, authController.logout);

// Admin Staff Management Routes
router.use(protect, restrictTo('admin')); // Protect all routes below this middleware
router.get('/staff', authController.getAllStaff);
router.post('/staff', authController.createStaff);
router.patch('/staff/:id', authController.updateStaff);
router.get('/staff/:id', authController.getStaffById);
router.delete('/staff/:id', authController.deleteStaff);

module.exports = router;