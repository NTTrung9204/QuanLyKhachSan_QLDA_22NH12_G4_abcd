const mongoose = require('mongoose');

const roomTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A room type must have a name'],
    trim: true,
    unique: true
  },
  pricePerNight: {
    type: Number,
    required: [true, 'A room type must have a price']
  },
  maxAdult: {
    type: Number,
    required: [true, 'A room type must specify maximum number of adults']
  },
  maxChild: {
    type: Number,
    required: [true, 'A room type must specify maximum number of children']
  },
  description: {
    type: String,
    trim: true
  },
  amenities: [String],
  facilityIds: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Facility'
  }],
  imageIds: [mongoose.Schema.ObjectId]
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Populate facilities when querying room types
roomTypeSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'facilityIds',
    select: 'name description icon'
  });
  next();
});

const RoomType = mongoose.model('RoomType', roomTypeSchema);

module.exports = RoomType; 