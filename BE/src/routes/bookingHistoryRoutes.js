const express = require('express');
const bookingHistoryController = require('../controllers/bookingHistoryController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes
router.use(protect);

// Customer routes
router.get('/my-bookings', bookingHistoryController.getUserBookings);

// Admin routes
router.get(
  '/admin',
  restrictTo('admin'),
  bookingHistoryController.getAdminBookingHistory
);

router.get(
  '/admin/:bookingId',
  restrictTo('admin'),
  bookingHistoryController.getBookingDetails
);

module.exports = router; 