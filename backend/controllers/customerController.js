const Customer = require('../models/Customer');

// @desc    Get all customers (admin only)
// @route   GET /api/customers
const getCustomers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } }
      : {};
    const customers = await Customer.find({ ...keyword, isDeleted: false })
      .populate('user', 'name email');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate('user', 'name email');
    if (!customer || customer.isDeleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new customer (admin only)
// @route   POST /api/customers
const createCustomer = async (req, res) => {
  const {
    user, name, email, phone, address,
    gender, nationality, deliveryAddress,
    contactForDelivery, notes
  } = req.body;
  try {
    const customer = await Customer.create({
      user, name, email, phone, address,
      gender, nationality, deliveryAddress,
      contactForDelivery, notes
    });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.isDeleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    customer.name = req.body.name || customer.name;
    customer.email = req.body.email || customer.email;
    customer.phone = req.body.phone || customer.phone;
    customer.address = req.body.address || customer.address;
    customer.gender = req.body.gender || customer.gender;
    customer.nationality = req.body.nationality || customer.nationality;
    customer.deliveryAddress = req.body.deliveryAddress || customer.deliveryAddress;
    customer.contactForDelivery = req.body.contactForDelivery || customer.contactForDelivery;
    customer.notes = req.body.notes || customer.notes;
    customer.profilePicture = req.body.profilePicture || customer.profilePicture;

    const updated = await customer.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Soft delete customer (admin only)
// @route   DELETE /api/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer || customer.isDeleted) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    customer.isDeleted = true;
    await customer.save();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
};