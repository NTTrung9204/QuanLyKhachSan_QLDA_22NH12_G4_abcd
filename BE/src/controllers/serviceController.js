const Service = require('../models/serviceModel');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

/**
 * Get all services
 */
exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find().populate('imageId');
  ResponseHandler.success(res, 200, services, 'Services retrieved successfully');
});

/**
 * Get a single service
 */
exports.getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id).populate('imageId');

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  ResponseHandler.success(res, 200, service, 'Service retrieved successfully');
});

/**
 * Create a new service
 */
exports.createService = catchAsync(async (req, res, next) => {
  const newService = await Service.create(req.body);
  ResponseHandler.success(res, 201, newService, 'Service created successfully');
});

/**
 * Update a service
 */
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  ResponseHandler.success(res, 200, service, 'Service updated successfully');
});

/**
 * Delete a service
 */
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  ResponseHandler.success(res, 200, null, 'Service deleted successfully');
}); 