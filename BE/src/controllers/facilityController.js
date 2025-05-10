const Facility = require('../models/facilityModel');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

/**
 * Get all facilities
 */
exports.getAllFacilities = catchAsync(async (req, res, next) => {
  const facilities = await Facility.find();
  ResponseHandler.success(res, 200, facilities, 'Facilities retrieved successfully');
});

/**
 * Get a single facility
 */
exports.getFacility = catchAsync(async (req, res, next) => {
  const facility = await Facility.findById(req.params.id);

  if (!facility) {
    return next(new AppError('No facility found with that ID', 404));
  }

  ResponseHandler.success(res, 200, facility, 'Facility retrieved successfully');
});

/**
 * Create a new facility
 */
exports.createFacility = catchAsync(async (req, res, next) => {
  const newFacility = await Facility.create(req.body);
  ResponseHandler.success(res, 201, newFacility, 'Facility created successfully');
});

/**
 * Update a facility
 */
exports.updateFacility = catchAsync(async (req, res, next) => {
  const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!facility) {
    return next(new AppError('No facility found with that ID', 404));
  }

  ResponseHandler.success(res, 200, facility, 'Facility updated successfully');
});

/**
 * Delete a facility
 */
exports.deleteFacility = catchAsync(async (req, res, next) => {
  const facility = await Facility.findByIdAndDelete(req.params.id);

  if (!facility) {
    return next(new AppError('No facility found with that ID', 404));
  }

  ResponseHandler.success(res, 200, null, 'Facility deleted successfully');
}); 