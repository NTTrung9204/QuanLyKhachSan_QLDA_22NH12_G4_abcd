const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A service must have a name'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'A service must have a price']
  },
  description: {
    type: String,
    trim: true
  },
  imageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service; 