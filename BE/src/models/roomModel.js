const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomTypeId: {
    type: mongoose.Schema.ObjectId,
    ref: 'RoomType',
    required: [true, 'A room must belong to a room type']
  },
  name: {
    type: String,
    required: [true, 'A room must have a name/number'],
    trim: true,
    unique: true
  },
  floor: {
    type: String,
    required: [true, 'A room must be assigned to a floor']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Populate room type when querying rooms
roomSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'roomTypeId',
    select: 'name pricePerNight maxAdult maxChild'
  });
  next();
});

const Room = mongoose.model('Room', roomSchema);

module.exports = Room; 