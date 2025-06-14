const express = require('express');
const serviceManagementController = require('../controllers/serviceManagementController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

// Protect all routes and restrict to staff and admin
router.use(protect);
router.use(restrictTo('staff', 'admin'));

// Add service to a booking room
router.post('/booking/add-service', serviceManagementController.addServiceToBooking);

// Remove service from a specific room in a booking
router.patch('/booking/remove-service', serviceManagementController.removeRoomServiceFromBooking);

module.exports = router; 