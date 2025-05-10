const express = require('express');
const facilityController = require('../controllers/facilityController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', facilityController.getAllFacilities);
router.get('/:id', facilityController.getFacility);

// Protected routes - only staff and admin
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('staff', 'admin'));

router.post('/', facilityController.createFacility);
router.patch('/:id', facilityController.updateFacility);
router.delete('/:id', facilityController.deleteFacility);

module.exports = router; 