const express = require('express');
const bookingHistoryController = require('../controllers/bookingHistoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/my-bookings', bookingHistoryController.getUserBookings);

module.exports = router; 