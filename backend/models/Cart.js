const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String
  },
  productImage: {
    type: String
  },
  size: {
    type: String
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number
  }
});

const CartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
    unique: true   // one cart per customer
  },
  items: [CartItemSchema],
  subtotal: {
    type: Number,
    default: 0
  },
  deliveryCost: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Auto-calculate totals before saving
CartSchema.pre('save', function (next) {
  this.items = this.items.map(item => {
    item.subtotal = item.quantity * item.unitPrice;
    return item;
  });
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.totalAmount = this.subtotal + this.deliveryCost;
  next();
});

module.exports = mongoose.model('Cart', CartSchema);