// backend/seed.js
const mongoose = require("mongoose");
require("dotenv").config();

const User     = require("./models/User");
const Bug      = require("./models/Bug");
const Cart     = require("./models/Cart");
const Customer = require("./models/Customer");
const Order    = require("./models/Order");
const Product  = require("./models/Product");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ Connected to MongoDB");

  // Clear all collections first
  await Promise.all([
    User.deleteMany({}),
    Bug.deleteMany({}),
    Cart.deleteMany({}),
    Customer.deleteMany({}),
    Order.deleteMany({}),
    Product.deleteMany({}),
  ]);
  console.log("🗑️  Cleared existing data");

  // ── USERS ──────────────────────────────────────────────
  const users = await User.insertMany([
    {
      name: "Alice Admin",
      email: "alice@example.com",
      password: "password123",
      role: "admin",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      password: "password123",
      role: "user",
    },
    {
      name: "Carol Jones",
      email: "carol@example.com",
      password: "password123",
      role: "user",
    },
  ]);
  console.log("👤 Users seeded");

  // ── CUSTOMERS ──────────────────────────────────────────
  const customers = await Customer.insertMany([
    {
      name: "John Nguyen",
      email: "john@customer.com",
      phone: "0412345678",
      address: "10 Queen St, Brisbane QLD 4000",
    },
    {
      name: "Sarah Lee",
      email: "sarah@customer.com",
      phone: "0498765432",
      address: "5 George St, Sydney NSW 2000",
    },
    {
      name: "Mike Taylor",
      email: "mike@customer.com",
      phone: "0411222333",
      address: "8 Collins St, Melbourne VIC 3000",
    },
  ]);
  console.log("🙋 Customers seeded");

  // ── PRODUCTS ───────────────────────────────────────────
  const products = await Product.insertMany([
    {
      name: "Laptop Pro 15",
      price: 1299.99,
      stock: 50,
      category: "Electronics",
      description: "High-performance 15-inch laptop",
    },
    {
      name: "Wireless Headphones",
      price: 199.99,
      stock: 120,
      category: "Electronics",
      description: "Noise-cancelling over-ear headphones",
    },
    {
      name: "Ergonomic Desk Chair",
      price: 349.00,
      stock: 30,
      category: "Furniture",
      description: "Adjustable lumbar support chair",
    },
    {
      name: "Mechanical Keyboard",
      price: 89.99,
      stock: 75,
      category: "Electronics",
      description: "TKL mechanical keyboard, blue switches",
    },
    {
      name: "USB-C Hub",
      price: 49.99,
      stock: 200,
      category: "Accessories",
      description: "7-in-1 USB-C hub with HDMI",
    },
  ]);
  console.log("📦 Products seeded");

  // ── ORDERS ─────────────────────────────────────────────
  await Order.insertMany([
    {
      customer: customers[0]._id,
      products: [
        { product: products[0]._id, quantity: 1 },
        { product: products[1]._id, quantity: 2 },
      ],
      totalAmount: 1699.97,
      status: "pending",
    },
    {
      customer: customers[1]._id,
      products: [
        { product: products[2]._id, quantity: 1 },
        { product: products[3]._id, quantity: 1 },
      ],
      totalAmount: 438.99,
      status: "shipped",
    },
    {
      customer: customers[2]._id,
      products: [{ product: products[4]._id, quantity: 3 }],
      totalAmount: 149.97,
      status: "delivered",
    },
  ]);
  console.log("🛒 Orders seeded");

  // ── CART ───────────────────────────────────────────────
  await Cart.insertMany([
    {
      user: users[1]._id,
      items: [
        { product: products[0]._id, quantity: 1 },
        { product: products[3]._id, quantity: 1 },
      ],
    },
    {
      user: users[2]._id,
      items: [{ product: products[1]._id, quantity: 2 }],
    },
  ]);
  console.log("🛍️  Carts seeded");

  // ── BUGS ───────────────────────────────────────────────
  await Bug.insertMany([
    {
      title: "Login fails on iOS Safari",
      description: "Users on iOS 17 cannot complete the login flow",
      status: "open",
      priority: "high",
      reportedBy: users[1]._id,
    },
    {
      title: "Cart total not updating",
      description: "Cart subtotal stays at $0 after adding a product",
      status: "in-progress",
      priority: "medium",
      reportedBy: users[2]._id,
    },
    {
      title: "Order status stuck on pending",
      description: "Shipped orders are not reflecting the correct status",
      status: "closed",
      priority: "low",
      reportedBy: users[0]._id,
    },
  ]);
  console.log("🐛 Bugs seeded");

  console.log("\n🎉 All seed data inserted successfully!");
  await mongoose.disconnect();
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});