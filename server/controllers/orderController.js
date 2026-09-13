const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { generateOrderNumber, roundMoney, calculateShippingFee } = require('../services/orderService');

// @desc    Create a new order from current cart
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { shippingAddress, paymentMethod = 'cod' } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.addressLine ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required shipping address fields (fullName, phone, addressLine, city, postalCode).',
      });
    }

    if (paymentMethod !== 'cod') {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method selected. Only Cash on Delivery (cod) is currently supported.',
      });
    }

    const cart = await Cart.findOne({ user: userId });
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty. Cannot place an order.',
      });
    }

    const orderItems = [];
    let calculatedSubtotal = 0;
    const stockUpdates = [];

    for (const item of cart.items) {
      const dbProduct = await Product.findById(item.product);

      if (!dbProduct) {
        return res.status(404).json({
          success: false,
          message: `Product in your cart no longer exists.`,
        });
      }

      if (dbProduct.isActive === false) {
        return res.status(400).json({
          success: false,
          message: `Product "${dbProduct.name}" is currently inactive and cannot be purchased.`,
        });
      }

      const availableStock = dbProduct.stock !== undefined ? dbProduct.stock : 0;
      if (availableStock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${dbProduct.name}". Requested: ${item.quantity}, Available: ${availableStock}.`,
        });
      }

      const itemPrice = roundMoney(dbProduct.price);
      const itemSubtotal = roundMoney(itemPrice * item.quantity);
      calculatedSubtotal = roundMoney(calculatedSubtotal + itemSubtotal);

      // Extract image robustly from product array/string schemas
      const rawImg = dbProduct.images?.[0]?.url || dbProduct.images?.[0] || dbProduct.image || 'https://via.placeholder.com/150';

      orderItems.push({
        product: dbProduct._id,
        name: dbProduct.name,
        image: rawImg,
        price: itemPrice,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });

      stockUpdates.push({
        productId: dbProduct._id,
        quantity: item.quantity,
      });
    }

    const shippingFee = calculateShippingFee(calculatedSubtotal);
    const discount = 0;
    const calculatedTotal = roundMoney(calculatedSubtotal + shippingFee - discount);
    const orderNumber = await generateOrderNumber();

    const order = new Order({
      orderNumber,
      user: userId,
      items: orderItems,
      shippingAddress: {
        fullName: shippingAddress.fullName.trim(),
        phone: shippingAddress.phone.trim(),
        addressLine: shippingAddress.addressLine.trim(),
        city: shippingAddress.city.trim(),
        postalCode: shippingAddress.postalCode.trim(),
        country: shippingAddress.country ? shippingAddress.country.trim() : 'Bangladesh',
      },
      subtotal: calculatedSubtotal,
      shippingFee,
      discount,
      total: calculatedTotal,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    const savedOrder = await order.save();
    // Populate the product details so images/names are fresh
    const createdOrder = await Order.findById(savedOrder._id).populate({
      path: 'items.product',
      select: 'name images image price',
    });

    for (const update of stockUpdates) {
      await Product.updateOne(
        { _id: update.productId, stock: { $gte: update.quantity } },
        { 
          $inc: { stock: -update.quantity },
          $set: { inStock: true } 
        }
      );
    }

    cart.items = [];
    cart.subtotal = 0;
    cart.shippingFee = 0;
    cart.total = 0;
    await cart.save();

    return res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      data: createdOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error creating order. Please try again.',
      error: error.message,
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const orders = await Order.find({ user: userId })
      .populate({
        path: 'items.product',
        select: 'name images image price',
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve order history.',
      error: error.message,
    });
  }
};

// @desc    Get order details by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }

    const order = await Order.findById(id).populate({
      path: 'items.product',
      select: 'name images image price',
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access. You cannot view another customer’s order.',
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch order details.',
      error: error.message,
    });
  }
};

// @desc    Get order details by ID
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID format.',
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    if (order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access. You can only cancel your own orders.',
      });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already in "${order.orderStatus}" status.`,
      });
    }

    order.orderStatus = 'cancelled';
    const savedOrder = await order.save();
    
    const updatedOrder = await Order.findById(savedOrder._id).populate({
      path: 'items.product',
      select: 'name images image price',
    });

    for (const item of order.items) {
      await Product.updateOne(
        { _id: item.product },
        { 
          $inc: { stock: item.quantity },
          $set: { inStock: true }
        }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Order has been successfully cancelled and stock restored.',
      data: updatedOrder,
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order.',
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};