const express = require('express');
const bookingController = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All booking routes require authentication
router.use(authMiddleware.protect);

// Routes for all authenticated users (customer, staff, admin)
router.get('/', bookingController.getAllBookings);

router.get('/date-range', bookingController.getBookingsByDateRange);

router.get('/future-pending', bookingController.getFuturePendingBookings);

router.get('/:id', bookingController.getBooking);
router.post('/', bookingController.createBooking);

// Routes for all authenticated users but with permission checking in the controller
router.patch('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);
router.patch('/:id/status', bookingController.updateBookingStatus);

// Routes for staff and admin only
router.use(authMiddleware.restrictTo('staff', 'admin'));
router.get('/customer/cccd/:cccd', bookingController.getBookingsByCustomerCCCD);
router.patch('/:id/check-in', bookingController.checkIn);
router.patch('/:id/check-out', bookingController.checkOut);

module.exports = router;