const bookingService = require('../services/bookingService');
const { catchAsync } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

/**
 * Get all bookings
 * Admin/staff can see all bookings, customers can only see their own bookings
 */
exports.getAllBookings = catchAsync(async (req, res, next) => {
  const bookings = await bookingService.getAllBookings(req.user);
  ResponseHandler.success(res, 200, bookings, 'Bookings retrieved successfully');
});

/**
 * Get a single booking
 * Admin/staff can see any booking, customers can only see their own bookings
 */
exports.getBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingService.getBooking(req.params.id, req.user);
  ResponseHandler.success(res, 200, booking, 'Booking retrieved successfully');
});

/**
 * Create a new booking
 * Customers can create their own bookings, staff/admin can create bookings for any customer
 */
exports.createBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingService.createBooking(req.body, req.user);
  ResponseHandler.success(res, 201, booking, 'Booking created successfully');
});

/**
 * Update a booking
 * Admin/staff can update any booking, customers can only update their own pending bookings
 */
exports.updateBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingService.updateBooking(req.params.id, req.body, req.user);
  ResponseHandler.success(res, 200, booking, 'Booking updated successfully');
});

/**
 * Delete a booking
 * Admin/staff can delete any booking, customers can only delete their own pending bookings
 */
exports.deleteBooking = catchAsync(async (req, res, next) => {
  await bookingService.deleteBooking(req.params.id, req.user);
  ResponseHandler.success(res, 200, null, 'Booking deleted successfully');
});

/**
 * Change booking status to checked_in
 * Only staff/admin can change status
 */
exports.checkIn = catchAsync(async (req, res, next) => {
  const booking = await bookingService.checkIn(req.params.id, req.user);
  ResponseHandler.success(res, 200, booking, 'Booking checked in successfully');
});

/**
 * Change booking status to checked_out
 * Only staff/admin can change status
 */
exports.checkOut = catchAsync(async (req, res, next) => {
  const booking = await bookingService.checkOut(req.params.id, req.user);
  ResponseHandler.success(res, 200, booking, 'Booking checked out successfully');
});

/**
 * Change booking status to cancelled
 * Staff/admin can cancel any booking, customers can only cancel their own pending bookings
 */
exports.cancelBooking = catchAsync(async (req, res, next) => {
  const booking = await bookingService.cancelBooking(req.params.id, req.user);
  ResponseHandler.success(res, 200, booking, 'Booking cancelled successfully');
});

/**
 * Get bookings by customer CCCD
 * Only staff and admin can access this feature
 */
exports.getBookingsByCustomerCCCD = catchAsync(async (req, res, next) => {
  const { cccd } = req.params;
  const bookings = await bookingService.getBookingsByCustomerCCCD(
    cccd,
    req.user
  );
  ResponseHandler.success(
    res,
    200,
    bookings,
    'Bookings retrieved successfully'
  );
});

/**
 * Get bookings within a specific date range
 * Admin/staff can see all bookings, customers can only see their own bookings
 */
exports.getBookingsByDateRange = catchAsync(async (req, res, next) => {
  const { checkIn, checkOut } = req.query;
  const bookings = await bookingService.getBookingsByDateRange(checkIn, checkOut, req.user);
  ResponseHandler.success(res, 200, bookings, 'Bookings within date range retrieved successfully');
});

/**
 * Update booking status
 * Admin/staff can update any booking status, customers have limited permissions
 */
exports.updateBookingStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return next(new AppError('Status is required', 400));
  }

  const booking = await bookingService.updateBookingStatus(
    id,
    status,
    req.user
  );

  let message = 'Booking status updated successfully';

  // Provide more specific message based on the status
  switch (status) {
    case 'checked_in':
      message = 'Booking checked in successfully';
      break;
    case 'checked_out':
      message = 'Booking checked out successfully';
      break;
    case 'cancelled':
      message = 'Booking cancelled successfully';
      break;
  }

  ResponseHandler.success(res, 200, booking, message);
});
