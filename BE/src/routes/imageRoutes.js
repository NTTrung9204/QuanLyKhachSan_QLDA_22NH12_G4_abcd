const express = require('express');
const imageController = require('../controllers/imageController');
const imageService = require('../services/imageService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes - anyone can view images
router.get('/', imageController.getAllImages);
router.get('/:id', imageController.getImage);

// Protected routes - only staff and admin
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('staff', 'admin'));

// Single image upload
router.post('/upload', imageService.uploadSingle, imageController.uploadImage);

// Multiple image upload
router.post('/upload-multiple', imageService.uploadMultiple, imageController.uploadMultipleImages);

// Update and delete
router.patch('/:id', imageController.updateImage);
router.delete('/:id', imageController.deleteImage);

module.exports = router; 