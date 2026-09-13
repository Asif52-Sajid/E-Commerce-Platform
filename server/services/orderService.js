const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');

// Utility to generate unique human-readable order numbers (e.g., ORD-20260831-A8F3)
const generateOrderNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  let orderNumber;
  let isUnique = false;

  while (!isUnique) {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase();
    orderNumber = `ORD-${dateStr}-${randomHex}`;
    const existing = await Order.findOne({ orderNumber });
    if (!existing) {
      isUnique = true;
    }
  }
  return orderNumber;
};

// Safe financial calculation rounding to avoid floating-point math issues
const roundMoney = (amount) => {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
};

// Simple configurable shipping logic
const calculateShippingFee = (subtotal) => {
  const FREE_SHIPPING_THRESHOLD = 5000;
  const STANDARD_SHIPPING_FEE = 100;

  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return STANDARD_SHIPPING_FEE;
};

module.exports = {
  generateOrderNumber,
  roundMoney,
  calculateShippingFee,
};