const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String    // snapshot of name at time of order
  },
  productImage: {
    type: String    // snapshot of image at time of order
  },
  size: {
    type: String    // selected size option
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number
  }
});

const OrderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  items: [OrderItemSchema],
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
  },
  status: {
    type: String,
    enum: [
      'pending',
      'confirmed',
      'in-progress',
      'ready',
      'delivered',
      'cancelled',
      'return-requested'
    ],
    default: 'pending'
  },
  estimatedArrival: {
    type: Date
  },
  deadline: {
    type: Date
  },
  deliveryMethod: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'pickup'
  },
  deliveryAddress: {
    type: String
  },
  contactForDelivery: {
    type: String
  },
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'deposit-paid', 'paid'],
    default: 'unpaid'
  },
  notes: {
    type: String
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Auto-calculate subtotals and total before saving
OrderSchema.pre('save', function (next) {
  this.items = this.items.map(item => {
    item.subtotal = item.quantity * item.unitPrice;
    return item;
  });
  this.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.totalAmount = this.subtotal + this.deliveryCost;
  next();
});

module.exports = mongoose.model('Order', OrderSchema);