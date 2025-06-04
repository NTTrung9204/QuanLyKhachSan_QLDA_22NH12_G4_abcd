const Room = require('../models/roomModel');
const Booking = require('../models/bookingModel');
const { AppError } = require('../utils/errorHandler');

/**
 * Get all rooms
 */
exports.getAllRooms = async (queryParams = {}) => {
  const query = Room.find();

  // Apply filters if provided
  if (queryParams.roomTypeId) {
    query.where('roomTypeId', queryParams.roomTypeId);
  }

  if (queryParams.floor) {
    query.where('floor', queryParams.floor);
  }

  return await query;
};

/**
 * Get a single room by ID
 */
exports.getRoomById = async (roomId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new AppError('No room found with that ID', 404);
  }

  return room;
};

/**
 * Find available rooms by date range
 */
exports.getAvailableRooms = async (checkIn, checkOut, roomTypeId = null) => {
  // Validate date inputs
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    throw new AppError('Invalid check-in or check-out date', 400);
  }

  if (checkInDate >= checkOutDate) {
    throw new AppError('Check-out date must be after check-in date', 400);
  }

  // Find all room IDs that are already booked for the specified date range
  const bookings = await Booking.find({
    'rooms.checkIn': { $lt: checkOutDate },
    'rooms.checkOut': { $gt: checkInDate },
    status: { $in: ['pending', 'checked_in'] } // Only consider active bookings
  });

  // Extract all booked room IDs
  const bookedRoomIds = new Set();
  bookings.forEach(booking => {
    booking.rooms.forEach(room => {
      const roomCheckIn = new Date(room.checkIn);
      const roomCheckOut = new Date(room.checkOut);
      
      // Check if this specific room booking overlaps with requested dates
      if (roomCheckIn < checkOutDate && roomCheckOut > checkInDate) {
        bookedRoomIds.add(room.roomId.toString());
      }
    });
  });

  // Build the query for available rooms
  let query = {};

  // Filter by roomTypeId if provided
  if (roomTypeId) {
    query.roomTypeId = roomTypeId;
  }

  // Get all rooms
  let rooms = await Room.find(query).populate({
    path: 'roomTypeId',
    select: 'name pricePerNight maxAdult maxChild description amenities'
  });

  // Filter out booked rooms
const availableRooms = rooms.filter(room => !bookedRoomIds.has(room._id.toString()));
  
  return availableRooms;
}; 

/**
 * Find available rooms for a specific date
 */
exports.getAvailableRoomsForDate = async (date, roomTypeId = null) => {
  // Validate date input
  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    throw new AppError('Invalid date format. Use YYYY-MM-DD.', 400);
  }

  // Create start and end of the day
  const startOfDay = new Date(targetDate);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(targetDate);
  endOfDay.setHours(23, 59, 59, 999);

  // Find all room IDs that are already booked for the specified date
  const bookings = await Booking.find({
    'rooms.checkIn': { $lt: endOfDay },
    'rooms.checkOut': { $gt: startOfDay },
    status: { $in: ['pending', 'checked_in'] }, // Only consider active bookings
  });

  // Extract all booked room IDs
  const bookedRoomIds = new Set();
  bookings.forEach((booking) => {
    booking.rooms.forEach((room) => {
      const roomCheckIn = new Date(room.checkIn);
      const roomCheckOut = new Date(room.checkOut);

      // Check if this specific room booking overlaps with requested date
      if (roomCheckIn < endOfDay && roomCheckOut > startOfDay) {
        bookedRoomIds.add(room.roomId.toString());
      }
    });
  });

  // Build the query for available rooms
  let query = {};

  // Filter by roomTypeId if provided
  if (roomTypeId) {
    query.roomTypeId = roomTypeId;
  }

  // Get all rooms
  let rooms = await Room.find(query).populate({
    path: 'roomTypeId',
    select: 'name pricePerNight maxAdult maxChild description amenities',
  });

  // Filter out booked rooms
  const availableRooms = rooms.filter(
    (room) => !bookedRoomIds.has(room._id.toString())
  );

  return availableRooms;
};
