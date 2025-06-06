const express = require('express');
const statisticsController = require('../controllers/statisticsController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware - require authentication
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin')); // Only admin can access statistics

router.get('/revenue', statisticsController.getRevenue);
router.get('/bookings-by-room-type', statisticsController.getBookingsByRoomType);
router.get('/bookings-by-date', statisticsController.getBookingsByDate);
router.get('/dashboard-stats', statisticsController.getDashboardStats);

module.exports = router; 