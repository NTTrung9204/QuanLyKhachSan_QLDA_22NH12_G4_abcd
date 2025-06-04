const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Protect all routes after this middleware
router.use(protect);

// Only allow staff and admin to access these routes
router.use(restrictTo('staff', 'admin'));

// Send bill via email
router.post('/:bookingId/send-bill', billingController.sendBillByEmail);

module.exports = router; 