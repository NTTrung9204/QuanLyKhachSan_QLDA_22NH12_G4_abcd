const mongoose = require('mongoose');

const roomBookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: [true, 'Room ID is required']
  },
  checkIn: {
    type: Date,
    required: [true, 'Check-in date is required']
  },
  checkOut: {
    type: Date,
    required: [true, 'Check-out date is required']
  },
  numAdult: {
    type: Number,
    required: [true, 'Number of adults is required'],
    min: [1, 'At least 1 adult is required']
  },
  numChild: {
    type: Number,
    default: 0
  }
});

const serviceBookingSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: [true, 'Service ID is required']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  useDate: {
    type: Date,
    required: [true, 'Service use date is required']
  }
});

const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer ID is required']
  },
  staffId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  rooms: {
    type: [roomBookingSchema],
    required: [true, 'At least one room booking is required'],
    validate: {
      validator: function(rooms) {
        return rooms.length > 0;
      },
      message: 'At least one room must be booked'
    }
  },
  services: {
    type: [serviceBookingSchema],
    default: []
  },
  status: {
    type: String,
    enum: ['pending', 'checked_in', 'checked_out', 'cancelled'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required']
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Pre-save middleware to validate check-in/check-out dates
bookingSchema.pre('save', function(next) {
  // For each room booking, ensure checkOut is after checkIn
  this.rooms.forEach(room => {
    if (room.checkOut <= room.checkIn) {
      const error = new Error('Check-out date must be after check-in date');
      return next(error);
    }
  });
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 