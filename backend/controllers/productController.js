const Product = require('../models/Product');

// @desc    Get all products (with optional search & category filter)
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const keyword = req.query.search
      ? { name: { $regex: req.query.search, $options: 'i' } }
      : {};
    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};
    const saleFilter = req.query.onSale === 'true' ? { isOnSale: true } : {};
    const popularFilter = req.query.popular === 'true' ? { isPopular: true } : {};

    const products = await Product.find({
      ...keyword,
      ...categoryFilter,
      ...saleFilter,
      ...popularFilter,
      isAvailable: true
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product (admin only)
// @route   POST /api/products
const createProduct = async (req, res) => {
  const {
    name, category, description, image,
    priceOptions, basePrice, promotionLabel,
    isOnSale, isPopular
  } = req.body;
  try {
    const product = await Product.create({
      name, category, description, image,
      priceOptions, basePrice, promotionLabel,
      isOnSale, isPopular,
      createdBy: req.user.id
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product (admin only)
// @route   PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.name = req.body.name || product.name;
    product.category = req.body.category || product.category;
    product.description = req.body.description || product.description;
    product.image = req.body.image || product.image;
    product.priceOptions = req.body.priceOptions || product.priceOptions;
    product.basePrice = req.body.basePrice ?? product.basePrice;
    product.promotionLabel = req.body.promotionLabel || product.promotionLabel;
    product.isOnSale = req.body.isOnSale ?? product.isOnSale;
    product.isPopular = req.body.isPopular ?? product.isPopular;
    product.isAvailable = req.body.isAvailable ?? product.isAvailable;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (admin only)
// @route   DELETE /api/products/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};