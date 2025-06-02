const Booking = require('../models/bookingModel');

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
}

module.exports = new BookingHistoryService(); 