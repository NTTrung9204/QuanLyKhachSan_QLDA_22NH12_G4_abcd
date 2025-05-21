const Service = require("../models/serviceModel");
const serviceService = require("../services/serviceService");
const { catchAsync } = require("../utils/errorHandler");
const { AppError } = require("../utils/errorHandler");
const ResponseHandler = require("../utils/responseHandler");

/**
 * Get all services
 */
exports.getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find();
  ResponseHandler.success(
    res,
    200,
    services,
    "Services retrieved successfully"
  );
});

/**
 * Get a single service
 */
exports.getService = catchAsync(async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    ResponseHandler.success(
      res,
      200,
      service,
      "Service retrieved successfully"
    );
  } catch (error) {
    return next(error);
  }
});

/**
 * Create a new service
 * @access Restricted to staff and admin
 */
exports.createService = catchAsync(async (req, res, next) => {
  try {
    const newService = await serviceService.createService(req.body);
    ResponseHandler.success(
      res,
      201,
      newService,
      "Service created successfully"
    );
  } catch (error) {
    return next(error);
  }
});

/**
 * Update a service
 * @access Restricted to staff and admin
 */
exports.updateService = catchAsync(async (req, res, next) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body);
    ResponseHandler.success(res, 200, service, "Service updated successfully");
  } catch (error) {
    return next(error);
  }
});

/**
 * Delete a service
 * @access Restricted to staff and admin
 */
exports.deleteService = catchAsync(async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id);
    ResponseHandler.success(res, 200, null, "Service deleted successfully");
  } catch (error) {
    return next(error);
  }
});

/**
 * Get service by price range
 */
exports.getServicesByPriceRange = catchAsync(async (req, res, next) => {
  const { minPrice, maxPrice } = req.query;

  try {
    const services = await serviceService.getServicesByPriceRange(
      minPrice,
      maxPrice
    );
    ResponseHandler.success(
      res,
      200,
      services,
      "Services retrieved successfully"
    );
  } catch (error) {
    return next(error);
  }
});
