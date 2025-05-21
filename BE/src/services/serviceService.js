const Service = require("../models/serviceModel");
const { AppError } = require("../utils/errorHandler");

/**
 * Get service by ID
 * @param {string} serviceId - Service ID
 * @returns {Object} Service object
 */
exports.getServiceById = async (serviceId) => {
  const service = await Service.findById(serviceId);
  if (!service) {
    throw new AppError("Service not found", 404);
  }
  return service;
};

/**
 * Create a new service
 * @param {Object} serviceData - Service data
 * @returns {Object} Created service
 */
exports.createService = async (serviceData) => {
  const { name, price, description, imageId } = serviceData;

  // Check if service with same name already exists
  const existingService = await Service.findOne({ name });
  if (existingService) {
    throw new AppError("Service with this name already exists", 400);
  }

  // Create new service
  const newService = await Service.create({
    name,
    price,
    description,
    imageId,
  });

  return newService;
};

/**
 * Update service details
 * @param {string} serviceId - Service ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated service
 */
exports.updateService = async (serviceId, updateData) => {
  // Check if service exists
  const service = await this.getServiceById(serviceId);

  // If updating name, check if the new name already exists
  if (updateData.name && updateData.name !== service.name) {
    const existingService = await Service.findOne({ name: updateData.name });
    if (existingService) {
      throw new AppError("Service with this name already exists", 400);
    }
  }

  // Update service
  const updatedService = await Service.findByIdAndUpdate(
    serviceId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedService;
};

/**
 * Delete a service
 * @param {string} serviceId - Service ID
 * @returns {boolean} Success indicator
 */
exports.deleteService = async (serviceId) => {
  // Check if service exists
  await this.getServiceById(serviceId);

  // Delete the service
  await Service.findByIdAndDelete(serviceId);

  return true;
};

/**
 * Get services by price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {Array} Array of services within price range
 */
exports.getServicesByPriceRange = async (minPrice, maxPrice) => {
  const filter = {};

  // Add price filter if provided
  if (minPrice !== undefined && maxPrice !== undefined) {
    filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
  } else if (minPrice !== undefined) {
    filter.price = { $gte: Number(minPrice) };
  } else if (maxPrice !== undefined) {
    filter.price = { $lte: Number(maxPrice) };
  }

  return await Service.find(filter);
};
