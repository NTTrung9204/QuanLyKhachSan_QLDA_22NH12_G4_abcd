const Booking = require('../models/bookingModel');
const { AppError } = require('../utils/errorHandler');

class BookingHistoryService {
  async getUserBookings(userId) {
    try {
      const currentDate = new Date();

      const bookings = await Booking.find({ customerId: userId })
        .populate({
          path: 'rooms.roomId',
          populate: {
            path: 'roomTypeId',
            select: 'name pricePerNight description imageIds'
          }
        })
        .populate('services.serviceId')
        .sort({ 'rooms.checkIn': -1 }); // Sort by check-in date, newest first

      // Categorize bookings
      const categorizedBookings = {
        past: [],
        current: [],
        future: []
      };

      bookings.forEach(booking => {
        const processedBooking = booking.toObject();
        
        // Process each room booking
        processedBooking.rooms.forEach(room => {
          const checkIn = new Date(room.checkIn);
          const checkOut = new Date(room.checkOut);
          
          // Add associated services for this room's stay period
          room.services = processedBooking.services.filter(service => {
            const serviceDate = new Date(service.useDate);
            return serviceDate >= checkIn && serviceDate <= checkOut;
          });
        });

        // Determine booking category based on the latest check-out date
        const latestCheckOut = new Date(Math.max(...processedBooking.rooms.map(r => new Date(r.checkOut))));
        const earliestCheckIn = new Date(Math.min(...processedBooking.rooms.map(r => new Date(r.checkIn))));

        if (latestCheckOut < currentDate) {
          categorizedBookings.past.push(processedBooking);
        } else if (earliestCheckIn > currentDate) {
          categorizedBookings.future.push(processedBooking);
        } else {
          categorizedBookings.current.push(processedBooking);
        }
      });

      return categorizedBookings;
    } catch (error) {
      throw error;
    }
  }

  async getAdminBookingHistory(query) {
    try {
      const {
        startDate,
        endDate,
        status,
        roomType,
        customerId,
        page = 1,
        limit = 10,
        sortBy = 'checkIn',
        sortOrder = 'desc'
      } = query;

      // Build filter object
      const filter = {};

      // Date range filter
      if (startDate || endDate) {
        filter['rooms.checkIn'] = {};
        if (startDate) filter['rooms.checkIn'].$gte = new Date(startDate);
        if (endDate) filter['rooms.checkIn'].$lte = new Date(endDate);
      }

      // Status filter
      if (status) {
        filter.status = status;
      }

      // Customer filter
      if (customerId) {
        filter.customerId = customerId;
      }

      // Room type filter (need to join with Room model)
      const roomTypeFilter = roomType ? {
        'rooms.roomId.roomTypeId': roomType
      } : {};

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const bookings = await Booking.find(filter)
        .populate({
          path: 'customerId',
          select: 'profile.firstName profile.lastName profile.email profile.phone'
        })
        .populate({
          path: 'staffId',
          select: 'profile.firstName profile.lastName'
        })
        .populate({
          path: 'rooms.roomId',
          populate: {
            path: 'roomTypeId',
            select: 'name pricePerNight'
          }
        })
        .populate('services.serviceId')
        .sort(sort)
        .skip(skip)
        .limit(limit);

      // Get total count for pagination
      const total = await Booking.countDocuments(filter);

      // Process bookings to add additional information
      const processedBookings = bookings.map(booking => {
        const bookingObj = booking.toObject();

        // Calculate total nights for each room
        bookingObj.rooms = bookingObj.rooms.map(room => {
          const checkIn = new Date(room.checkIn);
          const checkOut = new Date(room.checkOut);
          const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
          
          // Add services used during this room's stay
          const roomServices = bookingObj.services.filter(service => {
            const serviceDate = new Date(service.useDate);
            return serviceDate >= checkIn && serviceDate <= checkOut;
          });

          return {
            ...room,
            nights,
            services: roomServices
          };
        });

        return bookingObj;
      });

      return {
        bookings: processedBookings,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
          limit: Number(limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  async getBookingDetails(bookingId) {
    try {
      const booking = await Booking.findById(bookingId)
        .populate({
          path: 'customerId',
          select: 'profile.firstName profile.lastName profile.email profile.phone'
        })
        .populate({
          path: 'staffId',
          select: 'profile.firstName profile.lastName'
        })
        .populate({
          path: 'rooms.roomId',
          populate: {
            path: 'roomTypeId',
            select: 'name pricePerNight description imageIds'
          }
        })
        .populate('services.serviceId');

      if (!booking) {
        throw new AppError('Booking not found', 404);
      }

      const bookingObj = booking.toObject();

      // Calculate total nights and add services for each room
      bookingObj.rooms = bookingObj.rooms.map(room => {
        const checkIn = new Date(room.checkIn);
        const checkOut = new Date(room.checkOut);
        const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        
        // Add services used during this room's stay
        const roomServices = bookingObj.services.filter(service => {
          const serviceDate = new Date(service.useDate);
          return serviceDate >= checkIn && serviceDate <= checkOut;
        });

        return {
          ...room,
          nights,
          services: roomServices
        };
      });

      return bookingObj;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new BookingHistoryService(); 