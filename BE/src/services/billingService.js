const Booking = require('../models/bookingModel');
const { AppError } = require('../utils/errorHandler');
const { sendBillEmail } = require('../utils/emailService');

class BillingService {
  /**
   * Send bill via email for a booking
   */
  async sendBillByEmail(bookingId, user) {
    // Only staff/admin can send bills
    if (user.role !== 'staff' && user.role !== 'admin') {
      throw new AppError('You are not authorized to send bills', 403);
    }

    // Get booking with all necessary details
    const booking = await Booking.findById(bookingId)
      .populate({
        path: 'customerId',
        select: 'profile.fullName profile.email profile.phone'
      })
      .populate('staffId', 'profile.fullName')
      .populate({
        path: 'rooms.roomId',
        select: 'name roomTypeId',
        populate: {
          path: 'roomTypeId',
          select: 'name pricePerNight'
        }
      })
      .populate({
        path: 'services.serviceId',
        select: 'name price'
      });

    if (!booking) {
      throw new AppError('No booking found with that ID', 404);
    }

    // Only allow sending bills for checked-out bookings
    if (booking.status !== 'checked_out') {
      throw new AppError('Can only send bills for checked-out bookings', 400);
    }

    // Get customer details
    const customerName = booking.customerId.profile.fullName;
    // const customerEmail = "trung9204@gmail.com"; // Hardcoded for testing
    const customerEmail = booking.customerId.profile.email;

    console.log(booking.customerId);

    if (!customerEmail) {
      throw new AppError('Customer email not found', 400);
    }

    try {
      // Send email with customer name and email
      await sendBillEmail({
        ...booking.toObject(),
        customerId: { name: customerName, email: customerEmail }
      }, customerEmail);

      return {
        message: `Bill sent successfully to ${customerEmail}`,
        booking: {
          ...booking.toObject(),
          customerId: { name: customerName, email: customerEmail }
        }
      };
    } catch (error) {
      throw new AppError(`Failed to send email: ${error.message}`, 500);
    }
  }
}

module.exports = new BillingService(); 