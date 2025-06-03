const Booking = require('../models/bookingModel');
const Room = require('../models/roomModel');
const RoomType = require('../models/roomTypeModel');
const Service = require('../models/serviceModel');
const { AppError } = require('../utils/errorHandler');

/**
 * Calculate total amount based on rooms and services
 */
const calculateTotalAmount = async (rooms, services = []) => {
  let totalAmount = 0;
  
  // Calculate room costs
  for (const room of rooms) {
    // Get the room data first
    const roomData = await Room.findById(room.roomId);
    if (!roomData) {
      throw new AppError(`Room with ID ${room.roomId} not found`, 404);
    }
    
    // Get the room type to access the price per night
    const roomType = await RoomType.findById(roomData.roomTypeId);
    if (!roomType) {
      throw new AppError(`Room type not found for room with ID ${room.roomId}`, 404);
    }
    
    // Ensure room type price is a valid number
    if (typeof roomType.pricePerNight !== 'number' || isNaN(roomType.pricePerNight)) {
      throw new AppError(`Invalid price for room type of room with ID ${room.roomId}`, 400);
    }
    
    // Calculate number of nights
    const checkIn = new Date(room.checkIn);
    const checkOut = new Date(room.checkOut);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    
    // Validate nights calculation
    if (isNaN(nights) || nights <= 0) {
      throw new AppError('Check-out date must be after check-in date', 400);
    }
    
    // Add to total amount using the room type's price per night
    totalAmount += roomType.pricePerNight * nights;
  }
  
  // Calculate service costs
  if (services && services.length > 0) {
    for (const service of services) {
      const serviceData = await Service.findById(service.serviceId);
      if (!serviceData) {
        throw new AppError(`Service with ID ${service.serviceId} not found`, 404);
      }
      
      // Ensure service price is a valid number
      if (typeof serviceData.price !== 'number' || isNaN(serviceData.price)) {
        throw new AppError(`Invalid price for service with ID ${service.serviceId}`, 400);
      }
      
      // Ensure quantity is a valid number
      if (typeof service.quantity !== 'number' || isNaN(service.quantity) || service.quantity <= 0) {
        throw new AppError(`Invalid quantity for service with ID ${service.serviceId}`, 400);
      }
      
      totalAmount += serviceData.price * service.quantity;
    }
  }
  
  // Final validation to ensure totalAmount is a valid number
  if (isNaN(totalAmount)) {
    throw new AppError('Failed to calculate total amount', 500);
  }
  
  return totalAmount;
};

/**
 * Get all bookings with filtering based on user role
 */
exports.getAllBookings = async (user) => {
  let query = {};
  
  // If user is a customer, they can only see their own bookings
  if (user.role === 'customer') {
    query.customerId = user._id;
  }
  
  return await Booking.find(query)
    .populate('customerId', 'name email phone')
    .populate('staffId', 'name')
    .populate({
      path: 'rooms.roomId',
      select: 'name roomTypeId',
      populate: {
        path: 'roomTypeId',
        select: 'name pricePerNight'
      }
    })
    .populate({
      path: 'services.serviceId',
      select: 'name price'
    });
};

/**
 * Get a single booking
 */
exports.getBooking = async (bookingId, user) => {
  const booking = await Booking.findById(bookingId)
    .populate('customerId', 'name email phone')
    .populate('staffId', 'name')
    .populate({
      path: 'rooms.roomId',
      select: 'name roomTypeId',
      populate: {
        path: 'roomTypeId',
        select: 'name pricePerNight'
      }
    })
    .populate({
      path: 'services.serviceId',
      select: 'name price'
    });

  if (!booking) {
    throw new AppError('No booking found with that ID', 404);
  }

  // If user is a customer, they can only see their own bookings
  if (user.role === 'customer' && booking.customerId._id.toString() !== user._id.toString()) {
    throw new AppError('You are not authorized to view this booking', 403);
  }

  return booking;
};

/**
 * Check for overlapping bookings for a room
 */
const checkRoomAvailability = async (roomId, checkIn, checkOut, excludeBookingId = null) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  // Find any overlapping bookings
  const query = {
    'rooms.roomId': roomId,
    'rooms.checkIn': { $lt: checkOutDate },
    'rooms.checkOut': { $gt: checkInDate },
    status: { $in: ['pending', 'checked_in'] }
  };

  // If we're updating a booking, exclude the current booking from the check
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const overlappingBookings = await Booking.find(query);

  if (overlappingBookings.length > 0) {
    // Find the specific overlapping room booking for better error message
    const overlappingRoom = overlappingBookings[0].rooms.find(
      room => room.roomId.toString() === roomId.toString() &&
      new Date(room.checkIn) < checkOutDate &&
      new Date(room.checkOut) > checkInDate
    );

    throw new AppError(
      `Room is already booked from ${new Date(overlappingRoom.checkIn).toLocaleDateString()} to ${new Date(overlappingRoom.checkOut).toLocaleDateString()}`,
      400
    );
  }
};

/**
 * Create a new booking
 */
exports.createBooking = async (bookingData, user) => {
  const newBookingData = { ...bookingData };
  
  // Validate that rooms array exists and is not empty
  if (!newBookingData.rooms || !Array.isArray(newBookingData.rooms) || newBookingData.rooms.length === 0) {
    throw new AppError('At least one room must be booked', 400);
  }
  
  // Validate each room in the rooms array
  for (const room of newBookingData.rooms) {
    if (!room.roomId) {
      throw new AppError('Room ID is required for each room booking', 400);
    }
    
    if (!room.checkIn || !room.checkOut) {
      throw new AppError('Check-in and check-out dates are required for each room booking', 400);
    }
    
    if (!room.numAdult || typeof room.numAdult !== 'number' || room.numAdult < 1) {
      throw new AppError('At least 1 adult is required for each room booking', 400);
    }
    
    // Ensure check-in is before check-out
    const checkIn = new Date(room.checkIn);
    const checkOut = new Date(room.checkOut);
    
    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      throw new AppError('Invalid check-in or check-out date format', 400);
    }
    
    if (checkIn >= checkOut) {
      throw new AppError('Check-out date must be after check-in date', 400);
    }

    // Check for overlapping bookings
    await checkRoomAvailability(room.roomId, checkIn, checkOut);
  }
  
  // Validate services if provided
  if (newBookingData.services) {
    if (!Array.isArray(newBookingData.services)) {
      throw new AppError('Services must be an array', 400);
    }
    
    for (const service of newBookingData.services) {
      if (!service.serviceId) {
        throw new AppError('Service ID is required for each service booking', 400);
      }
      
      if (!service.quantity || typeof service.quantity !== 'number' || service.quantity < 1) {
        throw new AppError('Quantity must be at least 1 for each service booking', 400);
      }
      
      if (!service.useDate) {
        throw new AppError('Use date is required for each service booking', 400);
      }
      
      // Validate use date
      const useDate = new Date(service.useDate);
      if (isNaN(useDate.getTime())) {
        throw new AppError('Invalid use date format for service', 400);
      }
    }
  }
  
  // Set customerId based on user role
  if (user.role === 'customer') {
    // Customers can only book for themselves
    newBookingData.customerId = user._id;
  } else if (!newBookingData.customerId) {
    // Staff/admin must specify a customer
    throw new AppError('Customer ID is required', 400);
  }
  
  try {
    // Calculate total amount
    newBookingData.totalAmount = await calculateTotalAmount(
      newBookingData.rooms, 
      newBookingData.services || []
    );
    
    // Create the booking
    const newBooking = await Booking.create(newBookingData);
    
    // Return the created booking with populated fields
    return await Booking.findById(newBooking._id)
      .populate('customerId', 'name email phone')
      .populate('staffId', 'name')
      .populate({
        path: 'rooms.roomId',
        select: 'name roomTypeId',
        populate: {
          path: 'roomTypeId',
          select: 'name pricePerNight'
        }
      })
      .populate({
        path: 'services.serviceId',
        select: 'name price'
      });
  } catch (error) {
    // If error is already an AppError, rethrow it
    if (error.name === 'AppError') {
      throw error;
    }
    
    // Check for MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new AppError(`Validation error: ${messages.join(', ')}`, 400);
    }
    
    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      throw new AppError('Duplicate key error', 400);
    }
    
    // Other errors
    throw new AppError('Error creating booking: ' + error.message, 500);
  }
};

/**
 * Update a booking
 */
exports.updateBooking = async (bookingId, updateData, user) => {
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    throw new AppError('No booking found with that ID', 404);
  }
  
  // Check permissions
  if (user.role === 'customer') {
    // Customers can only update their own bookings
    if (booking.customerId.toString() !== user._id.toString()) {
      throw new AppError('You are not authorized to update this booking', 403);
    }
    
    // Customers can only update pending bookings
    if (booking.status !== 'pending') {
      throw new AppError('You can only update pending bookings', 400);
    }
    
    // Customers cannot update customerId
    if (updateData.customerId) {
      throw new AppError('You cannot change the customer for this booking', 403);
    }
  } else if (user.role === 'staff' || user.role === 'admin') {
    // Staff/admin can update staffId
    updateData.staffId = user._id;
  }
  
  // Validate rooms if provided
  if (updateData.rooms) {
    if (!Array.isArray(updateData.rooms) || updateData.rooms.length === 0) {
      throw new AppError('At least one room must be booked', 400);
    }
    
    for (const room of updateData.rooms) {
      if (!room.roomId) {
        throw new AppError('Room ID is required for each room booking', 400);
      }
      
      if (!room.checkIn || !room.checkOut) {
        throw new AppError('Check-in and check-out dates are required for each room booking', 400);
      }
      
      if (!room.numAdult || typeof room.numAdult !== 'number' || room.numAdult < 1) {
        throw new AppError('At least 1 adult is required for each room booking', 400);
      }
      
      // Ensure check-in is before check-out
      const checkIn = new Date(room.checkIn);
      const checkOut = new Date(room.checkOut);
      
      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        throw new AppError('Invalid check-in or check-out date format', 400);
      }
      
      if (checkIn >= checkOut) {
        throw new AppError('Check-out date must be after check-in date', 400);
      }

      // Check for overlapping bookings, excluding the current booking
      await checkRoomAvailability(room.roomId, checkIn, checkOut, bookingId);
    }
  }
  
  // Validate services if provided
  if (updateData.services) {
    if (!Array.isArray(updateData.services)) {
      throw new AppError('Services must be an array', 400);
    }
    
    for (const service of updateData.services) {
      if (!service.serviceId) {
        throw new AppError('Service ID is required for each service booking', 400);
      }
      
      if (!service.quantity || typeof service.quantity !== 'number' || service.quantity < 1) {
        throw new AppError('Quantity must be at least 1 for each service booking', 400);
      }
      
      if (!service.useDate) {
        throw new AppError('Use date is required for each service booking', 400);
      }
      
      // Validate use date
      const useDate = new Date(service.useDate);
      if (isNaN(useDate.getTime())) {
        throw new AppError('Invalid use date format for service', 400);
      }
    }
  }
  
  try {
    // Recalculate total amount if rooms or services are updated
    if (updateData.rooms || updateData.services) {
      const rooms = updateData.rooms || booking.rooms;
      const services = updateData.services || booking.services;
      updateData.totalAmount = await calculateTotalAmount(rooms, services);
    }
    
    // Update the booking
    return await Booking.findByIdAndUpdate(bookingId, updateData, {
      new: true,
      runValidators: true
    })
      .populate('customerId', 'name email phone')
      .populate('staffId', 'name')
      .populate({
        path: 'rooms.roomId',
        select: 'name roomTypeId',
        populate: {
          path: 'roomTypeId',
          select: 'name pricePerNight'
        }
      })
      .populate({
        path: 'services.serviceId',
        select: 'name price'
      });
  } catch (error) {
    // If error is already an AppError, rethrow it
    if (error.name === 'AppError') {
      throw error;
    }
    
    // Check for MongoDB validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new AppError(`Validation error: ${messages.join(', ')}`, 400);
    }
    
    // Check for MongoDB duplicate key error
    if (error.code === 11000) {
      throw new AppError('Duplicate key error', 400);
    }
    
    // Other errors
    throw new AppError('Error updating booking: ' + error.message, 500);
  }
};

/**
 * Delete a booking
 */
exports.deleteBooking = async (bookingId, user) => {
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    throw new AppError('No booking found with that ID', 404);
  }
  
  // Check permissions
  if (user.role === 'customer') {
    // Customers can only delete their own bookings
    if (booking.customerId.toString() !== user._id.toString()) {
      throw new AppError('You are not authorized to delete this booking', 403);
    }
    
    // Customers can only delete bookings with status 'pending'
    if (booking.status !== 'pending') {
      throw new AppError('You can only delete pending bookings', 400);
    }
  }
  
  return await Booking.findByIdAndDelete(bookingId);
};

/**
 * Change booking status to checked_in
 */
exports.checkIn = async (bookingId, user) => {
  // Only staff/admin can check in
  if (user.role !== 'staff' && user.role !== 'admin') {
    throw new AppError('You are not authorized to check in bookings', 403);
  }
  
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    throw new AppError('No booking found with that ID', 404);
  }
  
  // Can only check in pending bookings
  if (booking.status !== 'pending') {
    throw new AppError(`Cannot check in a booking with status '${booking.status}'`, 400);
  }
  
  // Update booking status and staffId
  return await Booking.findByIdAndUpdate(
    bookingId,
    { 
      status: 'checked_in',
      staffId: user._id 
    },
    {
      new: true,
      runValidators: true
    }
  )
    .populate('customerId', 'name email phone')
    .populate('staffId', 'name')
    .populate({
      path: 'rooms.roomId',
      select: 'name roomTypeId',
      populate: {
        path: 'roomTypeId',
        select: 'name pricePerNight'
      }
    })
    .populate({
      path: 'services.serviceId',
      select: 'name price'
    });
};

/**
 * Change booking status to checked_out
 */
exports.checkOut = async (bookingId, user) => {
  // Only staff/admin can check out
  if (user.role !== 'staff' && user.role !== 'admin') {
    throw new AppError('You are not authorized to check out bookings', 403);
  }
  
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    throw new AppError('No booking found with that ID', 404);
  }
  
  // Can only check out checked_in bookings
  if (booking.status !== 'checked_in') {
    throw new AppError(`Cannot check out a booking with status '${booking.status}'`, 400);
  }
  
  // Update booking status and staffId
  return await Booking.findByIdAndUpdate(
    bookingId,
    { 
      status: 'checked_out',
      staffId: user._id 
    },
    {
      new: true,
      runValidators: true
    }
  )
    .populate('customerId', 'name email phone')
    .populate('staffId', 'name')
    .populate({
      path: 'rooms.roomId',
      select: 'name roomTypeId',
      populate: {
        path: 'roomTypeId',
        select: 'name pricePerNight'
      }
    })
    .populate({
      path: 'services.serviceId',
      select: 'name price'
    });
};

/**
 * Change booking status to cancelled
 */
exports.cancelBooking = async (bookingId, user) => {
  const booking = await Booking.findById(bookingId);
  
  if (!booking) {
    throw new AppError('No booking found with that ID', 404);
  }
  
  // Check permissions
  if (user.role === 'customer') {
    // Customers can only cancel their own bookings
    if (booking.customerId.toString() !== user._id.toString()) {
      throw new AppError('You are not authorized to cancel this booking', 403);
    }
    
    // Customers can only cancel pending bookings
    if (booking.status !== 'pending') {
      throw new AppError('You can only cancel pending bookings', 400);
    }
  }
  
  // Update the staffId for staff/admin
  const updateData = { status: 'cancelled' };
  if (user.role === 'staff' || user.role === 'admin') {
    updateData.staffId = user._id;
  }
  
  // Update booking status
  return await Booking.findByIdAndUpdate(
    bookingId,
    updateData,
    {
      new: true,
      runValidators: true
    }
  )
    .populate('customerId', 'name email phone')
    .populate('staffId', 'name')
    .populate({
      path: 'rooms.roomId',
      select: 'name roomTypeId',
      populate: {
        path: 'roomTypeId',
        select: 'name pricePerNight'
      }
    })
    .populate({
      path: 'services.serviceId',
      select: 'name price'
    });
}; 