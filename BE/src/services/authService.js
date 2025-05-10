const User = require('../models/userModel');
const { AppError } = require('../utils/errorHandler');
const jwtUtils = require('../utils/jwtUtils');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User and token
 */
exports.registerUser = async (userData) => {
  const { username, password, fullName, phone, address, cccd, birthDate, gender } = userData;
  
  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new AppError('Username already in use', 400);
  }

  // Create new user
  const newUser = await User.create({
    username,
    passwordHash: password, // Will be hashed by pre-save hook
    role: 'customer', // Default role
    profile: {
      fullName,
      phone,
      address,
      cccd,
      birthDate,
      gender,
      state: 'active'
    }
  });

  // Generate token
  const token = jwtUtils.signToken(newUser._id);

  // Remove passwordHash from output
  newUser.passwordHash = undefined;

  return { user: newUser, token };
};

/**
 * Authenticate user
 * @param {string} username - Username
 * @param {string} password - User password
 * @returns {Object} User and token
 */
exports.loginUser = async (username, password) => {
  // Check if username and password exist
  if (!username || !password) {
    throw new AppError('Please provide username and password', 400);
  }

  // Find user by username
  const user = await User.findOne({ username, 'profile.state': 'active' }).select('+passwordHash');
  
  // Check if user exists and password is correct
  if (!user || !(await user.correctPassword(password))) {
    throw new AppError('Incorrect username or password', 401);
  }

  // Generate token
  const token = jwtUtils.signToken(user._id);

  // Remove passwordHash from output
  user.passwordHash = undefined;

  return { user, token };
}; 