const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: [true, 'An image must have a filename'],
    trim: true
  },
  path: {
    type: String,
    required: [true, 'An image must have a path'],
    trim: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  tags: [String]
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image; 