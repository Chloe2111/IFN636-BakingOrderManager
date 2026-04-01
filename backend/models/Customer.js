const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer not to say']
  },
  nationality: {
    type: String,
    trim: true
  },
  profilePicture: {
    type: String,
    default: ''
  },
  deliveryAddress: {
    type: String,  // for order shipment info shown on profile page
    trim: true
  },
  contactForDelivery: {
    type: String,
    trim: true
  },
  notes: {
    type: String   // e.g. allergies, preferences
  },
  isDeleted: {
    type: Boolean,
    default: false  // soft delete — admin "Delete Customer" feature
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);