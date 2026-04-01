const mongoose = require('mongoose');

// Sub-schema for size-based pricing (e.g. small/medium/large cake)
const PriceOptionSchema = new mongoose.Schema({
  size: {
    type: String,   // e.g. "Small", "Medium", "Large"
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['cake', 'cupcake', 'cookie', 'brownie', 'donut', 'bread', 'pastry', 'other'],
    default: 'other'
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,   // image URL or file path
    default: ''
  },
  priceOptions: [PriceOptionSchema],  // size-based pricing array
  basePrice: {
    type: Number,   // fallback single price if no size options
    min: 0
  },
  promotionLabel: {
    type: String,   // e.g. "Buy 3 get 1 free"
    default: ''
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);