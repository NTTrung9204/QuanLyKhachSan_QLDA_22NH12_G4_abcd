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