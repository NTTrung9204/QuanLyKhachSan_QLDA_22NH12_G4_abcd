const RoomType = require('../models/roomTypeModel');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

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