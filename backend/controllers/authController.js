const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, phone, password, address, gender, nationality, role, profilePicture } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await User.create({
      name, email, phone, password, address, gender, nationality,
      role: role || 'customer',
      profilePicture: profilePicture || '',
    });
    res.status(201).json({
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      phone:          user.phone,
      address:        user.address,
      gender:         user.gender,
      nationality:    user.nationality,
      role:           user.role,
      profilePicture: user.profilePicture,
      token:          generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, isDeleted: false });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.json({
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      phone:          user.phone,
      address:        user.address,
      gender:         user.gender,
      nationality:    user.nationality,
      role:           user.role,
      profilePicture: user.profilePicture,
      token:          generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user profile
// @route   GET /api/auth/profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/auth/profile
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name           = req.body.name           || user.name;
    user.email          = req.body.email          || user.email;
    user.phone          = req.body.phone          || user.phone;
    user.address        = req.body.address        || user.address;
    user.gender         = req.body.gender         || user.gender;
    user.nationality    = req.body.nationality    || user.nationality;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id:            updatedUser._id,
      name:           updatedUser.name,
      email:          updatedUser.email,
      phone:          updatedUser.phone,
      address:        updatedUser.address,
      gender:         updatedUser.gender,
      nationality:    updatedUser.nationality,
      role:           updatedUser.role,
      profilePicture: updatedUser.profilePicture,
      token:          generateToken(updatedUser._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete own account
// @route   DELETE /api/auth/profile
const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isDeleted = true;
    await user.save();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ── Admin-only user management ────────────────────────────────────────────────

// @desc    Get all users
// @route   GET /api/auth/users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single user by ID
// @route   GET /api/auth/users/:id
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update any user by ID
// @route   PUT /api/auth/users/:id
const updateUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.name           = req.body.name           || user.name;
    user.email          = req.body.email          || user.email;
    user.phone          = req.body.phone          || user.phone;
    user.address        = req.body.address        || user.address;
    user.gender         = req.body.gender         || user.gender;
    user.nationality    = req.body.nationality    || user.nationality;
    user.profilePicture = req.body.profilePicture || user.profilePicture;
    if (req.body.role) user.role = req.body.role;

    const updated = await user.save();
    res.json({
      _id:            updated._id,
      name:           updated.name,
      email:          updated.email,
      phone:          updated.phone,
      address:        updated.address,
      gender:         updated.gender,
      nationality:    updated.nationality,
      role:           updated.role,
      profilePicture: updated.profilePicture,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete any user by ID
// @route   DELETE /api/auth/users/:id
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isDeleted = true;
    await user.save();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
