const serviceManagementService = require('../services/serviceManagementService');
const { catchAsync } = require('../utils/errorHandler');

exports.getActiveBookings = catchAsync(async (req, res, next) => {
  const bookings = await serviceManagementService.getActiveBookings();
  
  res.status(200).json({
    status: 'success',
    data: {
      bookings
    }
  });
});

exports.getAvailableServices = catchAsync(async (req, res, next) => {
  const services = await serviceManagementService.getAvailableServices();
  
  res.status(200).json({
    status: 'success',
    data: {
      services
    }
  });
});

exports.addServiceToBooking = catchAsync(async (req, res, next) => {
  const staffId = req.user.id;
  const booking = await serviceManagementService.addServiceToBooking(req.body, staffId);
  
  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
});

exports.getBookingServices = catchAsync(async (req, res, next) => {
  const bookingServices = await serviceManagementService.getBookingServices(req.params.bookingId);
  
  res.status(200).json({
    status: 'success',
    data: bookingServices
  });
});

exports.removeServiceFromBooking = catchAsync(async (req, res, next) => {
  const booking = await serviceManagementService.removeServiceFromBooking(
    req.params.bookingId,
    req.params.serviceIndex
  );
  
  res.status(200).json({
    status: 'success',
    data: {
      booking
    }
  });
}); 

/**
 * Remove a service from a specific room in a booking
 */
exports.removeRoomServiceFromBooking = catchAsync(async (req, res, next) => {
  const { bookingId, roomIndex, serviceId, quantity } = req.body;

  // Validate required fields
  if (!bookingId || roomIndex === undefined || !serviceId) {
    return next(
      new AppError(
        'Missing required fields: bookingId, roomIndex, serviceId',
        400
      )
    );
  }

  // Validate roomIndex is a number
  if (isNaN(parseInt(roomIndex))) {
    return next(new AppError('roomIndex must be a number', 400));
  }

  // Convert quantity to number if provided
  let quantityToRemove = null;
  if (quantity !== undefined) {
    quantityToRemove = parseInt(quantity);
    if (isNaN(quantityToRemove)) {
      return next(new AppError('quantity must be a number', 400));
    }
  }

  const booking = await serviceManagementService.removeRoomServiceFromBooking(
    bookingId,
    parseInt(roomIndex),
    serviceId,
    quantityToRemove
  );

  res.status(200).json({
    status: 'success',
    message: 'Service removed successfully from the booking',
    data: {
      booking,
    },
  });
});
