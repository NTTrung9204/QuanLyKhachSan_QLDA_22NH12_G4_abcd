const mongoose = require("mongoose");

/**
 * Bill item schema
 */
const billItemSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["room", "service"],
    required: [true, "Item type is required"],
  },
  description: {
    type: String,
    required: [true, "Item description is required"],
  },
  amount: {
    type: Number,
    required: [true, "Item amount is required"],
    min: [0, "Amount cannot be negative"],
  },
});

/**
 * Bill schema
 */
const billSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.ObjectId,
    ref: "Booking",
    required: [true, "Booking ID is required"],
  },
  customerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Customer ID is required"],
  },
  staffId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Staff ID is required"],
  },
  items: {
    type: [billItemSchema],
    required: [true, "Bill items are required"],
    validate: {
      validator: function (items) {
        return items.length > 0;
      },
      message: "A bill must include at least one item",
    },
  },
  subTotal: {
    type: Number,
    required: [true, "Subtotal is required"],
  },
  tax: {
    type: Number,
    required: [true, "Tax amount is required"],
  },
  total: {
    type: Number,
    required: [true, "Total amount is required"],
  },
  printedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes to improve query performance
billSchema.index({ bookingId: 1 });
billSchema.index({ customerId: 1 });
billSchema.index({ printedAt: -1 });

// Populate booking, customer and staff references when querying
billSchema.pre(/^find/, function (next) {
  this.populate({
    path: "bookingId",
    select: "rooms.checkIn rooms.checkOut status",
  })
    .populate({
      path: "customerId",
      select: "username profile.fullName profile.phone",
    })
    .populate({
      path: "staffId",
      select: "username profile.fullName",
    });

  next();
});

const Bill = mongoose.model("Bill", billSchema);

module.exports = Bill;
