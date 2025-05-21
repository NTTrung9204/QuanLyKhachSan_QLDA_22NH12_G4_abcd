const mongoose = require("mongoose");

/**
 * Room type revenue schema
 */
const roomTypeRevenueSchema = new mongoose.Schema({
  type: {
    type: mongoose.Schema.ObjectId,
    ref: "RoomType",
    required: [true, "Room type ID is required"],
  },
  revenue: {
    type: Number,
    required: [true, "Revenue amount is required"],
    min: 0,
  },
});

/**
 * Service revenue schema
 */
const serviceRevenueSchema = new mongoose.Schema({
  serviceId: {
    type: mongoose.Schema.ObjectId,
    ref: "Service",
    required: [true, "Service ID is required"],
  },
  revenue: {
    type: Number,
    required: [true, "Revenue amount is required"],
    min: 0,
  },
});

/**
 * Statistic schema
 */
const statisticSchema = new mongoose.Schema({
  period: {
    type: String,
    required: [true, "Period is required"],
    unique: true,
    trim: true,
  },
  totalRevenue: {
    type: Number,
    required: [true, "Total revenue is required"],
    min: 0,
  },
  totalBookings: {
    type: Number,
    required: [true, "Total number of bookings is required"],
    min: 0,
  },
  roomRevenue: {
    type: Number,
    required: [true, "Room revenue is required"],
    min: 0,
  },
  serviceRevenue: {
    type: Number,
    required: [true, "Service revenue is required"],
    min: 0,
  },
  details: {
    byRoomType: [roomTypeRevenueSchema],
    byService: [serviceRevenueSchema],
  },
  generatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add index to improve query performance
statisticSchema.index({ period: 1 });
statisticSchema.index({ generatedAt: -1 });

// Populate room type and service references when querying
statisticSchema.pre(/^find/, function (next) {
  this.populate({
    path: "details.byRoomType.type",
    select: "name pricePerNight",
  }).populate({
    path: "details.byService.serviceId",
    select: "name price",
  });

  next();
});

const Statistic = mongoose.model("Statistic", statisticSchema);

module.exports = Statistic;
