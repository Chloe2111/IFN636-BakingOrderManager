const Cart = require('../models/Cart');

// @desc    Get current user's cart
// @route   GET /api/cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id })
      .populate('items.product', 'name image basePrice');
    if (!cart) return res.json({ items: [], totalAmount: 0 });
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart or update quantity
// @route   POST /api/cart
const addToCart = async (req, res) => {
  const { product, productName, productImage, size, quantity, unitPrice } = req.body;
  try {
    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      // Create new cart if none exists
      cart = await Cart.create({
        customer: req.user.id,
        items: [{ product, productName, productImage, size, quantity, unitPrice }]
      });
    } else {
      // Check if item already in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === product && item.size === size
      );
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product, productName, productImage, size, quantity, unitPrice });
      }
      await cart.save();
    }
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
const updateCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    item.quantity = req.body.quantity || item.quantity;
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
const removeCartItem = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.itemId
    );
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = [];
    await cart.save();
    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};