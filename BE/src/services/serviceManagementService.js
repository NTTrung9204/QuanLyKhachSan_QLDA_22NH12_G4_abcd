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

      // Validate quantity
      if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
        throw new AppError('Quantity must be a positive integer', 400);
      }

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

      // Check if this service already exists for this room on the same date
      const existingServiceIndex = booking.services.findIndex(
        (existingService) =>
          existingService.serviceId._id.toString() === serviceId &&
          new Date(existingService.useDate).toDateString() ===
            useDateTime.toDateString()
      );

      // Update total amount
      booking.totalAmount += service.price * quantity;

      if (existingServiceIndex !== -1) {
        // Service already exists, add to its quantity
        booking.services[existingServiceIndex].quantity += quantity;
      } else {
        // Add as a new service
        const newService = {
          serviceId,
          quantity,
          useDate: useDateTime,
          roomIndex,
          staffId: staffId,
        };
        booking.services.push(newService);
      }

      // Save the updated booking
      const updatedBooking = await booking.save();

      // Return processed booking with populated fields
      return await Booking.findById(updatedBooking._id)
        .populate('customerId', 'name email phone')
        .populate('staffId', 'name')
        .populate({
          path: 'services.serviceId',
          select: 'name price description'
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
        .populate('staffId', 'profile.firstName profile.lastName');

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

  async removeRoomServiceFromBooking(
    bookingId,
    roomIndex,
    serviceId,
    quantityToRemove = null
  ) {
    try {
      // Find the booking and populate services
      const booking = await Booking.findById(bookingId)
        .populate('services.serviceId');

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      // Check if booking is active (checked_in)
      if (booking.status !== 'checked_in') {
        throw new AppError('Can only modify services for active bookings', 400);
      }

      // Validate room index
      if (roomIndex < 0 || roomIndex >= booking.rooms.length) {
        throw new AppError(
          `Invalid room index: ${roomIndex}. Valid range: 0-${
            booking.rooms.length - 1
          }`,
          400
        );
      }

      // Find the index of the service to remove (matching both roomIndex and serviceId)
      const serviceIndex = booking.services.findIndex(
        (service) => service.serviceId._id.toString() === serviceId
      );

      if (serviceIndex === -1) {
        throw new AppError('Service not found for the specified room', 404);
      }

      // Get the service
      const service = booking.services[serviceIndex];

      if(service.useDate < new Date()) {
        throw new AppError('Cannot remove service that has already been used', 400);
      }

      // Handle quantity removal
      if (quantityToRemove !== null) {
        // Validate quantity to remove
        if (!Number.isInteger(quantityToRemove) || quantityToRemove <= 0) {
          throw new AppError(
            'Quantity to remove must be a positive integer',
            400
          );
        }

        // Check if quantity to remove exceeds the current quantity
        if (quantityToRemove > service.quantity) {
          throw new AppError(
            `Cannot remove ${quantityToRemove} units. Only ${service.quantity} units are available.`,
            400
          );
        }

        // Calculate refund amount for the removed quantity
        const refundAmount = service.serviceId.price * quantityToRemove;

        // Update the booking's total amount
        booking.totalAmount -= refundAmount;

        if (quantityToRemove === service.quantity) {
          // Remove the service completely if all quantity is removed
          booking.services.splice(serviceIndex, 1);
        } else {
          // Otherwise, reduce the quantity
          service.quantity -= quantityToRemove;
        }
      } else {
        // No quantity specified, remove the entire service
        const refundAmount = service.serviceId.price * service.quantity;
        booking.totalAmount -= refundAmount;
        booking.services.splice(serviceIndex, 1);
      }

      // Save the updated booking
      const updatedBooking = await booking.save();

      // Return processed booking with populated fields
      return await Booking.findById(updatedBooking._id)
        .populate('customerId', 'name email phone')
        .populate('staffId', 'name')
        .populate({
          path: 'services.serviceId',
          select: 'name price description',
        })
        .populate({
          path: 'rooms.roomId',
          populate: {
            path: 'roomTypeId',
            select: 'name',
          },
        });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ServiceManagementService();
