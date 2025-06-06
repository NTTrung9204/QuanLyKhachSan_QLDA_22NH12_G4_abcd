const User = require('../models/userModel');
const { AppError } = require('../utils/errorHandler');
const jwtUtils = require('../utils/jwtUtils');

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Object} User and token
 */
exports.registerUser = async (userData) => {
  const { username, password, fullName, email, phone, address, cccd, birthDate, gender } = userData;
  
  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new AppError('Username already in use', 400);
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ 'profile.email': email });
  if (existingEmail) {
    throw new AppError('Email already in use', 400);
  }

  // Create new user
  const newUser = await User.create({
    username,
    passwordHash: password, // Will be hashed by pre-save hook
    role: 'customer', // Default role
    profile: {
      fullName,
      email,
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

/**
 * Get all staff members
 * @returns {Array} List of staff members
 */
exports.getAllStaff = async () => {
  const staffMembers = await User.find({ role: 'staff' }).select('-passwordHash');
  return staffMembers;
};

/**
 * Get staff member by ID
 * @param {string} id - Staff member ID
 * @returns {Object} Staff member details
 */
exports.getStaffById = async (id) => {
  const staff = await User.findOne({ _id: id, role: 'staff' }).select('-passwordHash');
  if (!staff) {
    throw new AppError('Staff member not found', 404);
  }
  return staff;
};

/**
 * Create a new staff member
 * @param {Object} staffData - Staff member data
 * @returns {Object} Created staff member
 */
exports.createStaff = async (staffData) => {
  const { username, password, fullName, email, phone, address, cccd, birthDate, gender } = staffData;

  // Check if username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new AppError('Username already in use', 400);
  }

  // Check if email already exists
  const existingEmail = await User.findOne({ 'profile.email': email });
  if (existingEmail) {
    throw new AppError('Email already in use', 400);
  }

  // Create new staff member
  const newStaff = await User.create({
    username,
    passwordHash: password,
    role: 'staff',
    profile: {
      fullName,
      email,
      phone,
      address,
      cccd,
      birthDate,
      gender,
      state: 'active'
    }
  });

  // Remove passwordHash from output
  newStaff.passwordHash = undefined;

  return newStaff;
};

/**
 * Update staff member details
 * @param {string} id - Staff member ID
 * @param {Object} updateData - Data to update
 * @returns {Object} Updated staff member
 */
exports.updateStaff = async (id, updateData) => {
  const staff = await User.findOne({ _id: id, role: 'staff' });
  
  if (!staff) {
    throw new AppError('Staff member not found', 404);
  }

  // Check if updating email and it already exists
  if (updateData.email && updateData.email !== staff.profile.email) {
    const existingEmail = await User.findOne({ 'profile.email': updateData.email });
    if (existingEmail) {
      throw new AppError('Email already in use', 400);
    }
  }

  // Update profile fields
  const allowedUpdates = ['fullName', 'email', 'phone', 'address', 'cccd', 'birthDate', 'gender', 'state'];
  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      staff.profile[key] = updateData[key];
    }
  });

  // Update password if provided
  if (updateData.password) {
    staff.passwordHash = updateData.password;
  }

  await staff.save();

  // Remove passwordHash from output
  staff.passwordHash = undefined;

  return staff;
}; 