const bookingHistoryService = require('../services/bookingHistoryService');
const { catchAsync } = require('../utils/errorHandler');

exports.getUserBookings = catchAsync(async (req, res, next) => {
  const userId = req.user.id; // Assuming user ID is available from auth middleware
  
  const bookings = await bookingHistoryService.getUserBookings(userId);
  
  res.status(200).json({
    status: 'success',
    data: {
      past: bookings.past,
      current: bookings.current,
      future: bookings.future
    }
  });
});

exports.getAdminBookingHistory = catchAsync(async (req, res, next) => {
  const result = await bookingHistoryService.getAdminBookingHistory(req.query);
  
  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.getBookingDetails = catchAsync(async (req, res, next) => {
  const booking = await bookingHistoryService.getBookingDetails(req.params.bookingId);
  
  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
}); 