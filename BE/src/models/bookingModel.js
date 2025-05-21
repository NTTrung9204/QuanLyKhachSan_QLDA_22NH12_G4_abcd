const mongoose = require("mongoose");

/**
 * Room booking details schema
 */
const roomBookingSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.ObjectId,
    ref: "Room",
    required: [true, "Room ID is required"],
  },
  checkIn: {
    type: Date,
    required: [true, "Check-in date is required"],
  },
  checkOut: {
    type: Date,
    required: [true, "Check-out date is required"],
  },
  numAdult: {
    type: Number,
    required: [true, "Number of adults is required"],
    min: [1, "At least one adult is required"],
  },
  numChild: {
    type: Number,
    default: 0,
    min: 0,
  },
});

/**
 * Service usage schema
 */
const serviceUsageSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.ObjectId,
    ref: "Service",
    required: [true, "Service ID is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"],
  },
  useDate: {
    type: Date,
    required: [true, "Service usage date is required"],
  },
});

/**
 * Booking schema
 */
const bookingSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Customer ID is required"],
  },
  staffId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  rooms: {
    type: [roomBookingSchema],
    required: [true, "At least one room must be booked"],
    validate: {
      validator: function (rooms) {
        return rooms.length > 0;
      },
      message: "A booking must include at least one room",
    },
  },
  services: [serviceUsageSchema],
  status: {
    type: String,
    enum: ["pending", "checked_in", "checked_out", "cancelled"],
    default: "pending",
  },
  totalAmount: {
    type: Number,
    required: [true, "Total amount is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index to improve query performance
bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ "rooms.checkIn": 1, "rooms.checkOut": 1 });

// Update the updatedAt before saving
bookingSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Populate customer and staff references when querying
bookingSchema.pre(/^find/, function (next) {
  this.populate({
    path: "customerId",
    select: "username profile.fullName profile.phone",
  })
    .populate({
      path: "staffId",
      select: "username profile.fullName",
    })
    .populate({
      path: "rooms.roomId",
      select: "name floor roomTypeId",
    })
    .populate({
      path: "services.serviceId",
      select: "name price",
    });

  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
