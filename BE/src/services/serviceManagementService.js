const Booking = require('../models/bookingModel');
const Service = require('../models/serviceModel');
const { AppError } = require('../utils/errorHandler');

class ServiceManagementService {
  async getActiveBookings() {
    try {
      // Get all current active bookings (checked_in status)
      const activeBookings = await Booking.find({ status: 'checked_in' })
        .populate({
          path: 'customerId',
          select: 'profile.firstName profile.lastName profile.email profile.phone'
        })
        .populate({
          path: 'rooms.roomId',
          populate: {
            path: 'roomTypeId',
            select: 'name'
          }
        });

      return activeBookings;
    } catch (error) {
      throw error;
    }
  }

  async getAvailableServices() {
    try {
      const services = await Service.find()
        .populate('imageId', 'url');
      return services;
    } catch (error) {
      throw error;
    }
  }

  async addServiceToBooking(data, staffId) {
    try {
      const { bookingId, roomIndex, serviceId, quantity, useDate } = data;

      // Find the booking
      const booking = await Booking.findById(bookingId)
        .populate('services.serviceId');
        
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check if booking is active (checked_in)
      if (booking.status !== 'checked_in') {
        throw new AppError('Can only add services to active bookings (checked-in)', 400);
      }

      // Validate room index
      if (roomIndex >= booking.rooms.length) {
        throw new AppError('Invalid room index', 400);
      }

      // Check if service exists
      const service = await Service.findById(serviceId);
      if (!service) {
        throw new AppError('Service not found', 404);
      }

      // Validate useDate is within the room's booking period
      const room = booking.rooms[roomIndex];
      const useDateTime = new Date(useDate);
      const checkIn = new Date(room.checkIn);
      const checkOut = new Date(room.checkOut);

      if (useDateTime < checkIn || useDateTime > checkOut) {
        throw new AppError('Service use date must be within the room booking period', 400);
      }

      // Add the service to booking
      const newService = {
        serviceId,
        quantity,
        useDate: useDateTime,
        roomIndex,
        addedBy: staffId
      };

      booking.services.push(newService);

      // Update total amount
      booking.totalAmount += service.price * quantity;

      // Save the updated booking
      const updatedBooking = await booking.save();
      
      // Return processed booking with populated fields
      return await Booking.findById(updatedBooking._id)
        .populate({
          path: 'services.serviceId',
          select: 'name price description'
        })
        .populate({
          path: 'services.addedBy',
          select: 'profile.firstName profile.lastName'
        })
        .populate({
          path: 'rooms.roomId',
          populate: {
            path: 'roomTypeId',
            select: 'name'
          }
        });
    } catch (error) {
      throw error;
    }
  }

  async getBookingServices(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate({
          path: 'customerId',
          select: 'profile.firstName profile.lastName'
        })
        .populate({
          path: 'rooms.roomId',
          populate: {
            path: 'roomTypeId',
            select: 'name'
          }
        })
        .populate('services.serviceId')
        .populate('services.addedBy', 'profile.firstName profile.lastName');

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Group services by room
      const roomServices = booking.rooms.map((room, index) => {
        const services = booking.services.filter(service => service.roomIndex === index);
        return {
          roomInfo: {
            roomNumber: room.roomId.roomNumber,
            roomType: room.roomId.roomTypeId.name,
            checkIn: room.checkIn,
            checkOut: room.checkOut
          },
          services: services
        };
      });

      return {
        bookingId: booking._id,
        customerName: `${booking.customerId.profile.firstName} ${booking.customerId.profile.lastName}`,
        roomServices
      };
    } catch (error) {
      throw error;
    }
  }

  async removeServiceFromBooking(bookingId, serviceIndex) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate('services.serviceId');
      
      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      if (booking.status !== 'checked_in') {
        throw new AppError('Can only modify services for active bookings', 400);
      }

      if (serviceIndex >= booking.services.length) {
        throw new AppError('Invalid service index', 400);
      }

      // Calculate refund amount
      const service = booking.services[serviceIndex];
      const refundAmount = service.serviceId.price * service.quantity;

      // Remove the service
      booking.services.splice(serviceIndex, 1);
      booking.totalAmount -= refundAmount;

      await booking.save();

      return booking;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServiceManagementService(); 