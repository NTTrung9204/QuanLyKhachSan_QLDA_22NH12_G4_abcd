const express = require('express');
const roomTypeController = require('../controllers/roomTypeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', roomTypeController.getAllRoomTypes);
router.get('/:id', roomTypeController.getRoomType);
router.get('/:id/images', roomTypeController.getRoomTypeImages);

// Protected routes - only staff and admin
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('staff', 'admin'));

router.post('/', roomTypeController.createRoomType);
router.patch('/:id', roomTypeController.updateRoomType);
router.delete('/:id', roomTypeController.deleteRoomType);

// Image association routes
router.post('/:id/images', roomTypeController.addImagesToRoomType);
router.delete('/:id/images', roomTypeController.removeImagesFromRoomType);

module.exports = router; 