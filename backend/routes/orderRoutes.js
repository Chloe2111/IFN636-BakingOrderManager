const express = require('express');
const router = express.Router();
const {
  getOrders, getOrderById,
  getMyOrders, createOrder,
  updateOrder, cancelOrder
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// ⚠️ IMPORTANT: specific routes BEFORE dynamic /:id
router.get('/my-orders', protect, getMyOrders);
router.get('/',          protect, getOrders);
router.get('/:id',       protect, getOrderById);       // ← NO adminOnly here
router.post('/',         protect, createOrder);
router.put('/:id',       protect, updateOrder);
router.delete('/:id',    protect, adminOnly, cancelOrder);

module.exports = router;