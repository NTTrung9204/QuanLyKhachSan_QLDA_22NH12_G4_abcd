const mongoose = require("mongoose");

/**
 * Service schema
 */
const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Service name is required"],
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Service price is required"],
    min: [0, "Price cannot be negative"],
  },
  description: {
    type: String,
    trim: true,
  },
  imageId: {
    type: mongoose.Schema.ObjectId,
    ref: "Image",
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

// Update the updatedAt field before saving
serviceSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Populate image reference when querying
serviceSchema.pre(/^find/, function (next) {
  this.populate({
    path: "imageId",
    select: "path filename",
  });
  next();
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;
