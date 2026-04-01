const express = require('express');
const router = express.Router();
const {
  getBugs, getBugById,
  createBug, updateBug, deleteBug
} = require('../controllers/bugController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getBugs);
router.get('/:id', protect, getBugById);
router.post('/', protect, createBug);
router.put('/:id', protect, adminOnly, updateBug);
router.delete('/:id', protect, adminOnly, deleteBug);

module.exports = router;