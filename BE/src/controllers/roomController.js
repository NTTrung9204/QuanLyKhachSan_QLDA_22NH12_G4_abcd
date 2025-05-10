const Room = require('../models/roomModel');
const RoomType = require('../models/roomTypeModel');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

/**
 * Get all rooms
 */
exports.getAllRooms = catchAsync(async (req, res, next) => {
  // Build filter object
  const filter = {};
  
  // Filter by room type if provided
  if (req.query.roomType) {
    filter.roomTypeId = req.query.roomType;
  }
  
  // Filter by floor if provided
  if (req.query.floor) {
    filter.floor = req.query.floor;
  }

  const rooms = await Room.find(filter);
  ResponseHandler.success(res, 200, rooms, 'Rooms retrieved successfully');
});

/**
 * Get a single room
 */
exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findById(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  ResponseHandler.success(res, 200, room, 'Room retrieved successfully');
});

/**
 * Create a new room
 */
exports.createRoom = catchAsync(async (req, res, next) => {
  // Verify that the room type exists
  const roomType = await RoomType.findById(req.body.roomTypeId);
  if (!roomType) {
    return next(new AppError('No room type found with that ID', 404));
  }

  const newRoom = await Room.create(req.body);
  ResponseHandler.success(res, 201, newRoom, 'Room created successfully');
});

/**
 * Update a room
 */
exports.updateRoom = catchAsync(async (req, res, next) => {
  // If updating room type, verify that it exists
  if (req.body.roomTypeId) {
    const roomType = await RoomType.findById(req.body.roomTypeId);
    if (!roomType) {
      return next(new AppError('No room type found with that ID', 404));
    }
  }

  const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  ResponseHandler.success(res, 200, room, 'Room updated successfully');
});

/**
 * Delete a room
 */
exports.deleteRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findByIdAndDelete(req.params.id);

  if (!room) {
    return next(new AppError('No room found with that ID', 404));
  }

  ResponseHandler.success(res, 200, null, 'Room deleted successfully');
});

/**
 * Get rooms by floor
 */
exports.getRoomsByFloor = catchAsync(async (req, res, next) => {
  const rooms = await Room.find({ floor: req.params.floor });
  ResponseHandler.success(res, 200, rooms, `Rooms on floor ${req.params.floor} retrieved successfully`);
});

/**
 * Get rooms by room type
 */
exports.getRoomsByType = catchAsync(async (req, res, next) => {
  const rooms = await Room.find({ roomTypeId: req.params.roomTypeId });
  ResponseHandler.success(res, 200, rooms, 'Rooms of specified type retrieved successfully');
}); 