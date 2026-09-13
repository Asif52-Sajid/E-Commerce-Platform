const express = require('express');
const router = express.Router();
const { 
  createOrder, 
  getMyOrders, 
  getOrderById, 
  cancelOrder 
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

// All order endpoints require authentication
router.use(protect);

// POST /api/orders - Place Order
// GET /api/orders - Get My Orders List
router.route('/')
  .post(createOrder)
  .get(getMyOrders);

// GET /api/orders/:id - Get Order Details
router.route('/:id')
  .get(getOrderById);

// PUT /api/orders/:id/cancel - Cancel Pending Order
router.route('/:id/cancel')
  .put(cancelOrder);

module.exports = router;