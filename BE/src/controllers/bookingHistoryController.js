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