const Bug = require('../models/Bug');

// @desc    Get all bugs (admin) or own bugs (customer)
// @route   GET /api/bugs
const getBugs = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.reportedBy = req.user.id;
    }
    if (req.query.status) filter.status = req.query.status;
    if (req.query.search) {
      filter.bugName = { $regex: req.query.search, $options: 'i' };
    }

    const bugs = await Bug.find(filter)
      .populate('reportedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(bugs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single bug by ID
// @route   GET /api/bugs/:id
const getBugById = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id)
      .populate('reportedBy', 'name email');
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    res.json(bug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new bug report
// @route   POST /api/bugs
const createBug = async (req, res) => {
  const { bugName, description, importanceLevel, screenshot } = req.body;
  try {
    const bug = await Bug.create({
      bugName, description, importanceLevel,
      screenshot, reportedBy: req.user.id
    });
    res.status(201).json(bug);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update bug (admin only)
// @route   PUT /api/bugs/:id
const updateBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });

    bug.bugName = req.body.bugName || bug.bugName;
    bug.description = req.body.description || bug.description;
    bug.importanceLevel = req.body.importanceLevel || bug.importanceLevel;
    bug.status = req.body.status || bug.status;
    bug.screenshot = req.body.screenshot || bug.screenshot;

    const updated = await bug.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete bug (admin only)
// @route   DELETE /api/bugs/:id
const deleteBug = async (req, res) => {
  try {
    const bug = await Bug.findById(req.params.id);
    if (!bug) return res.status(404).json({ message: 'Bug not found' });
    await bug.deleteOne();
    res.json({ message: 'Bug deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug
};