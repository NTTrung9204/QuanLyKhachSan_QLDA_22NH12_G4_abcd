const Service = require('../models/serviceModel');
const RoomType = require('../models/roomTypeModel');

class HomeService {
  async getHomePageData() {
    try {
      // Get all services
      const services = await Service.find()
        .populate({
          path: 'imageId',
          select: 'url'
        });

      // Get all room types with their facilities
      const roomTypes = await RoomType.find()
        .populate({
          path: 'imageIds',
          select: 'url'
        });

      return {
        services,
        roomTypes
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new HomeService(); 