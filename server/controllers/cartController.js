const Cart = require('../models/Cart');
const Product = require('../models/Product');

const formatCartResponse = (cart) => {
  if (!cart) {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
    };
  }

  let subtotal = 0;
  let totalItems = 0;

  const items = cart.items
    .filter((item) => item.product != null)
    .map((item) => {
      const itemSubtotal = item.product.price * item.quantity;
      subtotal += itemSubtotal;
      totalItems += item.quantity;

      return {
        _id: item._id,
        product: {
          _id: item.product._id,
          name: item.product.name,
          price: item.product.price,
          images: item.product.images,
          stock: item.product.stock,
          isAvailable: item.product.isAvailable !== false,
        },
        quantity: item.quantity,
        subtotal: itemSubtotal,
      };
    });

  return {
    _id: cart._id,
    items,
    totalItems,
    subtotal,
  };
};

exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price images stock isAvailable',
    });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: formatCartResponse(null),
      });
    }

    return res.status(200).json({
      success: true,
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const currentQtyInCart = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
    const targetQuantity = currentQtyInCart + parsedQuantity;

    if (targetQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add requested quantity. Available stock: ${product.stock}`,
      });
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = targetQuantity;
    } else {
      cart.items.push({ product: productId, quantity: parsedQuantity });
    }

    await cart.save();

    cart = await cart.populate({
      path: 'items.product',
      select: 'name price images stock isAvailable',
    });

    return res.status(200).json({
      success: true,
      message: 'Item added to cart successfully',
      data: formatCartResponse(cart),
    });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const parsedQuantity = parseInt(quantity, 10);
    if (isNaN(parsedQuantity) || parsedQuantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a positive integer.',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      cart.items.splice(itemIndex, 1);
      await cart.save();
      return res.status(404).json({
        success: false,
        message: 'Product no longer exists. Removed from cart.',
      });
    }

    if (parsedQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Requested quantity exceeds available stock (${product.stock})`,
      });
    }

    cart.items[itemIndex].quantity = parsedQuantity;
    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images stock isAvailable',
    });

    return res.status(200).json({
      success: true,
      message: 'Cart item updated successfully',
      data: formatCartResponse(updatedCart),
    });
  } catch (error) {
    next(error);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name price images stock isAvailable',
    });

    return res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: formatCartResponse(updatedCart),
    });
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      data: formatCartResponse(null),
    });
  } catch (error) {
    next(error);
  }
};