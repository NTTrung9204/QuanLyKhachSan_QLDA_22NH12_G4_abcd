const Room = require('../models/roomModel');
const RoomType = require('../models/roomTypeModel');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');
const roomService = require('../services/roomService');

/**
 * Get all rooms
 */
exports.getAllRooms = catchAsync(async (req, res, next) => {
  const rooms = await roomService.getAllRooms(req.query);
  ResponseHandler.success(res, 200, rooms, 'Rooms retrieved successfully');
});

/**
 * Get a single room
 */
exports.getRoom = catchAsync(async (req, res, next) => {
  const room = await roomService.getRoomById(req.params.id);
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

/**
 * Get available rooms for a specific date range
 */
exports.getAvailableRooms = catchAsync(async (req, res, next) => {
  // Check if required query parameters are provided
  const { checkIn, checkOut } = req.query;
  
  if (!checkIn || !checkOut) {
    return next(new AppError('Please provide check-in and check-out dates', 400));
  }
  
  // Get available rooms based on provided dates and optional roomTypeId
  const availableRooms = await roomService.getAvailableRooms(
    checkIn, 
    checkOut, 
    req.query.roomTypeId
  );
  
  // Group available rooms by room type for easier client-side processing
  const roomsByType = {};
  
  availableRooms.forEach(room => {
    const roomTypeId = room.roomTypeId._id.toString();
    
    if (!roomsByType[roomTypeId]) {
      // Initialize room type data
      roomsByType[roomTypeId] = {
        roomTypeId: roomTypeId,
        name: room.roomTypeId.name,
        pricePerNight: room.roomTypeId.pricePerNight,
        maxAdult: room.roomTypeId.maxAdult,
        maxChild: room.roomTypeId.maxChild,
        description: room.roomTypeId.description,
        amenities: room.roomTypeId.amenities,
        availableRooms: []
      };
    }
    
    // Add room to the corresponding room type
    roomsByType[roomTypeId].availableRooms.push({
      _id: room._id,
      name: room.name,
      floor: room.floor
    });
  });
  
  // Convert the object to an array
  const result = Object.values(roomsByType);
  
  ResponseHandler.success(
    res, 
    200, 
    {
      checkIn,
      checkOut,
      totalAvailableRooms: availableRooms.length,
      roomTypes: result
    }, 
    'Available rooms retrieved successfully'
  );
}); 

/**
 * Get available rooms for a specific date
 */
exports.getAvailableRoomsForDate = catchAsync(async (req, res, next) => {
  // Check if required query parameter is provided
  const { date } = req.query;

  if (!date) {
    return next(new AppError('Please provide a date', 400));
  }

  // Get available rooms based on provided date and optional roomTypeId
  const availableRooms = await roomService.getAvailableRoomsForDate(
    date,
    req.query.roomTypeId
  );

  // Group available rooms by room type for easier client-side processing
  const roomsByType = {};

  availableRooms.forEach((room) => {
    const roomTypeId = room.roomTypeId._id.toString();

    if (!roomsByType[roomTypeId]) {
      // Initialize room type data
      roomsByType[roomTypeId] = {
        roomTypeId: roomTypeId,
        name: room.roomTypeId.name,
        pricePerNight: room.roomTypeId.pricePerNight,
        maxAdult: room.roomTypeId.maxAdult,
        maxChild: room.roomTypeId.maxChild,
        description: room.roomTypeId.description,
        amenities: room.roomTypeId.amenities,
        imageUrls: room.roomTypeId.imageId?.map((img) => img.url) || [],
        availableRooms: [],
      };
    }

    // Add room to the corresponding room type
    roomsByType[roomTypeId].availableRooms.push({
      _id: room._id,
      name: room.name,
      floor: room.floor,
      status: room.status,
    });
  });

  // Convert the object to an array
  const result = Object.values(roomsByType);

  ResponseHandler.success(
    res,
    200,
    {
      date,
      totalAvailableRooms: availableRooms.length,
      roomTypes: result,
    },
    'Available rooms for the date retrieved successfully'
  );
});
