const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.post('/register',  registerUser);
router.post('/login',     loginUser);

// Customer (logged in)
router.get('/profile',    protect, getUserProfile);
router.put('/profile',    protect, updateUserProfile);
router.delete('/profile', protect, deleteUserAccount);

// Admin only
router.get('/users',         protect, adminOnly, getAllUsers);
router.get('/users/:id',     protect, adminOnly, getUserById);
router.put('/users/:id',     protect, adminOnly, updateUserById);
router.delete('/users/:id',  protect, adminOnly, deleteUserById);

module.exports = router;