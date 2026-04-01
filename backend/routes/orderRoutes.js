const express = require('express');
const router = express.Router();
const {
  getOrders, getOrderById,
  createOrder, updateOrder, cancelOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getOrders);
router.get('/:id', protect, getOrderById);
router.post('/', protect, createOrder);
router.put('/:id', protect, updateOrder);
router.delete('/:id', protect, adminOnly, cancelOrder);

module.exports = router;