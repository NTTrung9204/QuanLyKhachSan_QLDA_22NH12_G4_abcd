const authService = require('../services/authService');
const { catchAsync } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');

/**
 * User signup
 */
exports.signup = catchAsync(async (req, res) => {
  const result = await authService.registerUser(req.body);
  res.status(201).json({
    status: 'success',
    data: result
  });
});

/**
 * User login
 */
exports.login = catchAsync(async (req, res) => {
  const { username, password } = req.body;
  const result = await authService.loginUser(username, password);
  res.status(200).json({
    status: 'success',
    data: result
  });
});

/**
 * User logout
 */
exports.logout = catchAsync(async (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully'
  });
});

// Staff Management Controllers
exports.getAllStaff = catchAsync(async (req, res) => {
  const staffMembers = await authService.getAllStaff();
  res.status(200).json({
    status: 'success',
    results: staffMembers.length,
    data: {
      staff: staffMembers
    }
  });
});

exports.getStaffById = catchAsync(async (req, res) => {
  const staff = await authService.getStaffById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      staff
    }
  });
});

exports.createStaff = catchAsync(async (req, res) => {
  const newStaff = await authService.createStaff(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      staff: newStaff
    }
  });
});

exports.updateStaff = catchAsync(async (req, res) => {
  const updatedStaff = await authService.updateStaff(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      staff: updatedStaff
    }
  });
});

exports.deleteStaff = catchAsync(async (req, res) => {
  const result = await authService.deleteStaff(req.params.id);
  res.status(200).json({
    status: 'success',
    data: result
  });
});