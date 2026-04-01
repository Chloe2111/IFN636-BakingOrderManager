const express = require('express');
const router = express.Router();
const {
  getCustomers, getCustomerById,
  createCustomer, updateCustomer, deleteCustomer
} = require('../controllers/customerController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, adminOnly, getCustomers);
router.get('/:id', protect, getCustomerById);
router.post('/', protect, adminOnly, createCustomer);
router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, adminOnly, deleteCustomer);

module.exports = router;