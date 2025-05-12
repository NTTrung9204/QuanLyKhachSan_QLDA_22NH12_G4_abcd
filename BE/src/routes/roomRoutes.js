const express = require('express');
const roomController = require('../controllers/roomController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', roomController.getAllRooms);
router.get('/available', roomController.getAvailableRooms);
router.get('/floor/:floor', roomController.getRoomsByFloor);
router.get('/type/:roomTypeId', roomController.getRoomsByType);
router.get('/:id', roomController.getRoom);

// Protected routes - only staff and admin
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('staff', 'admin'));

router.post('/', roomController.createRoom);
router.patch('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

module.exports = router; 