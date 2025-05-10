const User = require('../models/userModel');
const { AppError } = require('../utils/errorHandler');
const jwtUtils = require('../utils/jwtUtils');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User and token
 */
exports.registerUser = async (userData) => {
  const { firstName, lastName, email, phoneNumber, password } = userData;
  
  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already in use', 400);
  }

  // Create new user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    password
  });

  // Generate token
  const token = jwtUtils.signToken(newUser._id);

  // Remove password from output
  newUser.password = undefined;

  return { user: newUser, token };
};

/**
 * Authenticate user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} User and token
 */
exports.loginUser = async (email, password) => {
  // Check if email and password exist
  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  // Find user by email
  const user = await User.findOne({ email }).select('+password');
  
  // Check if user exists and password is correct
  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  // Generate token
  const token = jwtUtils.signToken(user._id);

  // Remove password from output
  user.password = undefined;

  return { user, token };
}; 