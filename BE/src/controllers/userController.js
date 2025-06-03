const User = require('../models/userModel');
const { catchAsync } = require('../utils/errorHandler');
const { AppError } = require('../utils/errorHandler');
const ResponseHandler = require('../utils/responseHandler');
const UserService = require('../services/userService');

/**
 * Get current user profile
 */
exports.getMyProfile = catchAsync(async (req, res, next) => {
  // User is already available from the protect middleware
  ResponseHandler.send(res, 200, req.user);
});

exports.getUserProfile = catchAsync(async (req, res, next) => {
  const { cccd } = req.params;

  // Find user by cccd
  const user = await UserService.getUserByCccd(cccd);

  ResponseHandler.send(res, 200, user);
});

/**
 * Update current user profile
 */
exports.updateMyProfile = catchAsync(async (req, res, next) => {
  const { fullName, phone, address, cccd, birthDate, gender } = req.body;
  
  // Find user by ID and update profile
  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      'profile.fullName': fullName,
      'profile.phone': phone,
      'profile.address': address,
      'profile.cccd': cccd,
      'profile.birthDate': birthDate,
      'profile.gender': gender,
      updatedAt: Date.now()
    },
    {
      new: true, // Return updated document
      runValidators: true // Run validators on update
    }
  );

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  ResponseHandler.send(res, 200, updatedUser);
}); 