const homeService = require('../services/homeService');
const { catchAsync } = require('../utils/errorHandler');

exports.getHomePageData = catchAsync(async (req, res, next) => {
  const data = await homeService.getHomePageData();
  
  res.status(200).json({
    status: 'success',
    data: {
      services: data.services,
      roomTypes: data.roomTypes
    }
  });
}); 