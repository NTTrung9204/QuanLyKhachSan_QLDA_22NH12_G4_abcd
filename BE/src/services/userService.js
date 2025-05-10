const User = require('../models/userModel');
const { AppError } = require('../utils/errorHandler');

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object} User object
 */
exports.getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};

/**
 * Get user profile by ID
 * @param {string} userId - User ID
 * @returns {Object} User profile data
 */
exports.getUserProfile = async (userId) => {
  const user = await this.getUserById(userId);
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phoneNumber: user.phoneNumber
  };
}; 