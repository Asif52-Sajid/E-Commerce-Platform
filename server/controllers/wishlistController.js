const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// Helper to format wishlist response
const formatWishlistResponse = (wishlist) => {
  if (!wishlist || !wishlist.products) {
    return {
      _id: null,
      products: [],
      totalItems: 0,
    };
  }

  const products = wishlist.products
    .filter((product) => product != null) // Filter out deleted products
    .map((product) => ({
      _id: product._id,
      name: product.name,
      price: product.price,
      images: product.images,
      stock: product.stock,
      isAvailable: product.isAvailable !== false,
    }));

  return {
    _id: wishlist._id,
    products,
    totalItems: products.length,
  };
};

// @desc    Get current user's wishlist
// @route   GET /api/wishlist
// @access  Private
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate({
      path: 'products',
      select: 'name price images stock isAvailable',
    });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: formatWishlistResponse(null),
      });
    }

    return res.status(200).json({
      success: true,
      data: formatWishlistResponse(wishlist),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve wishlist',
      error: error.message,
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    // 1. Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // 2. Find or create user wishlist
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    // 3. Prevent duplicate entry
    const exists = wishlist.products.some(
      (id) => id.toString() === productId
    );

    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }

    wishlist = await wishlist.populate({
      path: 'products',
      select: 'name price images stock isAvailable',
    });

    return res.status(200).json({
      success: true,
      message: exists ? 'Product already in wishlist' : 'Added to wishlist',
      data: formatWishlistResponse(wishlist),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to add product to wishlist',
      error: error.message,
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Wishlist not found',
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name price images stock isAvailable',
    });

    return res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: formatWishlistResponse(updatedWishlist),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to remove product from wishlist',
      error: error.message,
    });
  }
};

// @desc    Clear wishlist
// @route   DELETE /api/wishlist
// @access  Private
exports.clearWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = [];
      await wishlist.save();
    }

    return res.status(200).json({
      success: true,
      message: 'Wishlist cleared successfully',
      data: formatWishlistResponse(null),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to clear wishlist',
      error: error.message,
    });
  }
};