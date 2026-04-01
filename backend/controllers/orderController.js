const Order = require('../models/Order');

// @desc    Get all orders (admin) or own orders (customer)
// @route   GET /api/orders
const getOrders = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.createdBy = req.user.id;
    }
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
      .populate('customer', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.product', 'name image');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
const createOrder = async (req, res) => {
  const {
    customer, items, deliveryCost, deadline,
    deliveryMethod, deliveryAddress,
    contactForDelivery, paymentStatus, notes
  } = req.body;
  try {
    const order = await Order.create({
      customer, items, deliveryCost, deadline,
      deliveryMethod, deliveryAddress,
      contactForDelivery, paymentStatus, notes,
      createdBy: req.user.id
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status or details
// @route   PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
    order.estimatedArrival = req.body.estimatedArrival || order.estimatedArrival;
    order.notes = req.body.notes || order.notes;
    order.deliveryAddress = req.body.deliveryAddress || order.deliveryAddress;

    const updated = await order.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel order (admin only)
// @route   DELETE /api/orders/:id
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    order.status = 'cancelled';
    await order.save();
    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  cancelOrder
};