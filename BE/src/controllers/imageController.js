const Image = require('../models/imageModel');
const imageService = require('../services/imageService');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');
const fs = require('fs').promises;
const path = require('path');

/**
 * Get all images
 */
exports.getAllImages = catchAsync(async (req, res, next) => {
  // Filter by tags if provided
  const filter = {};
  if (req.query.tags) {
    filter.tags = { $in: req.query.tags.split(',') };
  }

  const images = await Image.find(filter);
  ResponseHandler.success(res, 200, images, 'Images retrieved successfully');
});

/**
 * Get a single image
 */
exports.getImage = catchAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    return next(new AppError('No image found with that ID', 404));
  }

  ResponseHandler.success(res, 200, image, 'Image retrieved successfully');
});

/**
 * Upload a single image
 */
exports.uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  // Create image record in database
  const newImage = await Image.create({
    filename: req.file.filename,
    path: imageService.getFilePath(req, req.file.filename),
    tags: req.body.tags ? req.body.tags.split(',') : []
  });

  ResponseHandler.success(res, 201, newImage, 'Image uploaded successfully');
});

/**
 * Upload multiple images
 */
exports.uploadMultipleImages = catchAsync(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new AppError('Please upload at least one image', 400));
  }

  const tags = req.body.tags ? req.body.tags.split(',') : [];
  
  // Create image records for each uploaded file
  const imagePromises = req.files.map(file => {
    return Image.create({
      filename: file.filename,
      path: imageService.getFilePath(req, file.filename),
      tags
    });
  });

  const images = await Promise.all(imagePromises);

  ResponseHandler.success(res, 201, images, 'Images uploaded successfully');
});

/**
 * Update image details (tags)
 */
exports.updateImage = catchAsync(async (req, res, next) => {
  const image = await Image.findByIdAndUpdate(
    req.params.id,
    { tags: req.body.tags ? req.body.tags.split(',') : [] },
    {
      new: true,
      runValidators: true
    }
  );

  if (!image) {
    return next(new AppError('No image found with that ID', 404));
  }

  ResponseHandler.success(res, 200, image, 'Image updated successfully');
});

/**
 * Delete an image
 */
exports.deleteImage = catchAsync(async (req, res, next) => {
  const image = await Image.findById(req.params.id);

  if (!image) {
    return next(new AppError('No image found with that ID', 404));
  }

  // Delete file from filesystem
  try {
    const filePath = path.join('public/uploads', image.filename);
    await fs.unlink(filePath);
  } catch (err) {
    console.error('Error deleting file:', err);
    // Continue even if file deletion fails
  }

  // Delete record from database
  await Image.findByIdAndDelete(req.params.id);

  ResponseHandler.success(res, 200, null, 'Image deleted successfully');
}); 