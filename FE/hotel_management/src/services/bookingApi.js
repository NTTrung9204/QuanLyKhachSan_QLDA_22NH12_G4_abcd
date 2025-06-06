import axiosClient from './axiosClient';

export const bookingApi = {
  // Get all bookings
  getAllBookings: () => {
    return axiosClient.get('/bookings');
  },

  // Get a single booking
  getBooking: (id) => {
    return axiosClient.get(`/bookings/${id}`);
  },

  // Create a new booking
  createBooking: (data) => {
    return axiosClient.post('/bookings', data);
  },

  // Update a booking
  updateBooking: (id, data) => {
    return axiosClient.patch(`/bookings/${id}`, data);
  },

  // Delete a booking
  deleteBooking: (id) => {
    return axiosClient.delete(`/bookings/${id}`);
  },

  // Get bookings by date range
  getBookingsByDateRange: (checkIn, checkOut) => {
    return axiosClient.get(`/bookings/date-range?checkIn=${checkIn}&checkOut=${checkOut}`);
  },

  // Get future pending bookings
  getFuturePendingBookings: () => {
    return axiosClient.get('/bookings/future-pending');
  },

  // Check in a booking
  checkIn: (id) => {
    return axiosClient.patch(`/bookings/${id}/check-in`);
  },

  // Check out a booking
  checkOut: (id) => {
    return axiosClient.patch(`/bookings/${id}/check-out`);
  },

  // Cancel a booking
  cancelBooking: (id) => {
    return axiosClient.patch(`/bookings/${id}/cancel`);
  },

  // Update booking status
  updateBookingStatus: (id, status) => {
    return axiosClient.patch(`/bookings/${id}/status`, { status });
  },

  // Get bookings by customer CCCD
  getBookingsByCustomerCCCD: (cccd) => {
    return axiosClient.get(`/bookings/customer/cccd/${cccd}`);
  }
}; 