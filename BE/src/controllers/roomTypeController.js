const RoomType = require('../models/roomTypeModel');
const Image = require('../models/imageModel');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');
const mongoose = require('mongoose');

/**
 * Get all room types
 */
exports.getAllRoomTypes = catchAsync(async (req, res, next) => {
  const roomTypes = await RoomType.find();
  ResponseHandler.success(res, 200, roomTypes, 'Room types retrieved successfully');
});

/**
 * Get a single room type
 */
exports.getRoomType = catchAsync(async (req, res, next) => {
  const roomType = await RoomType.findById(req.params.id);

  if (!roomType) {
    return next(new AppError('No room type found with that ID', 404));
  }

  ResponseHandler.success(res, 200, roomType, 'Room type retrieved successfully');
});

/**
 * Get all images for a room type
 */
exports.getRoomTypeImages = catchAsync(async (req, res, next) => {
  const roomType = await RoomType.findById(req.params.id);

  if (!roomType) {
    return next(new AppError('No room type found with that ID', 404));
  }

  // Check if room type has any images
  if (!roomType.imageIds || roomType.imageIds.length === 0) {
    return ResponseHandler.success(res, 200, [], 'No images found for this room type');
  }

  // Find all images associated with this room type
  const images = await Image.find({
    _id: { $in: roomType.imageIds }
  });

  ResponseHandler.success(res, 200, images, 'Room type images retrieved successfully');
});

/**
 * Create a new room type
 */
exports.createRoomType = catchAsync(async (req, res, next) => {
  const newRoomType = await RoomType.create(req.body);
  ResponseHandler.success(res, 201, newRoomType, 'Room type created successfully');
});

/**
 * Update a room type
 */
exports.updateRoomType = catchAsync(async (req, res, next) => {
  const roomType = await RoomType.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!roomType) {
    return next(new AppError('No room type found with that ID', 404));
  }

  ResponseHandler.success(res, 200, roomType, 'Room type updated successfully');
});

/**
 * Delete a room type
 */
exports.deleteRoomType = catchAsync(async (req, res, next) => {
  const roomType = await RoomType.findByIdAndDelete(req.params.id);

  if (!roomType) {
    return next(new AppError('No room type found with that ID', 404));
  }

  ResponseHandler.success(res, 200, null, 'Room type deleted successfully');
});

/**
 * Associate images with a room type
 */
exports.addImagesToRoomType = catchAsync(async (req, res, next) => {
  // Check if imageIds are provided
  if (!req.body.imageIds || !Array.isArray(req.body.imageIds) || req.body.imageIds.length === 0) {
    return next(new AppError('Please provide at least one image ID', 400));
  }

  // Verify all images exist
  const imageCount = await Image.countDocuments({
    _id: { $in: req.body.imageIds }
  });

  if (imageCount !== req.body.imageIds.length) {
    return next(new AppError('One or more image IDs are invalid', 400));
  }

  // Update room type with new image IDs
  const roomType = await RoomType.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { imageIds: { $each: req.body.imageIds } } },
    { new: true }
  );

  if (!roomType) {
    return next(new AppError('No room type found with that ID', 404));
  }

  // Add tags to the images
  await Image.updateMany(
    { _id: { $in: req.body.imageIds } },
    { $addToSet: { tags: `room_type_${roomType.name.toLowerCase().replace(/\s+/g, '_')}` } }
  );

  ResponseHandler.success(res, 200, roomType, 'Images added to room type successfully');
});

/**
 * Remove images from a room type
 */
exports.removeImagesFromRoomType = catchAsync(async (req, res, next) => {
  // Check if imageIds are provided
  if (!req.body.imageIds || !Array.isArray(req.body.imageIds) || req.body.imageIds.length === 0) {
    return next(new AppError('Please provide at least one image ID', 400));
  }

  // Get room type
  const roomType = await RoomType.findById(req.params.id);
  
  if (!roomType) {
    return next(new AppError('No room type found with that ID', 404));
  }

  // Update room type by removing specified image IDs
  const updatedRoomType = await RoomType.findByIdAndUpdate(
    req.params.id,
    { $pull: { imageIds: { $in: req.body.imageIds } } },
    { new: true }
  );

  // Remove tag from the images
  await Image.updateMany(
    { _id: { $in: req.body.imageIds } },
    { $pull: { tags: `room_type_${roomType.name.toLowerCase().replace(/\s+/g, '_')}` } }
  );

  ResponseHandler.success(res, 200, updatedRoomType, 'Images removed from room type successfully');
}); 