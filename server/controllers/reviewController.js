const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// @desc    Get approved reviews for a product (Public - supports both ID and Slug)
// @route   GET /api/reviews/product/:productId
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const paramId = req.params.productId || req.params.id;
    let targetProductId = paramId;

    // If the param is not a valid MongoDB ObjectId, treat it as a slug or name
    if (!mongoose.Types.ObjectId.isValid(paramId)) {
      const foundProduct = await Product.findOne({
        $or: [
          { slug: paramId },
          { name: { $regex: new RegExp(`^${paramId}$`, 'i') } }
        ]
      });
      if (foundProduct) {
        targetProductId = foundProduct._id;
      }
    }

    const reviews = await Review.find({ 
      product: targetProductId, 
      isApproved: true 
    })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new review (Verified delivered purchase check)
// @route   POST /api/reviews/:productId
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment, image } = req.body;
    let productId = req.params.productId;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      const foundProduct = await Product.findOne({
        $or: [{ slug: productId }, { name: { $regex: new RegExp(`^${productId}$`, 'i') } }]
      });
      if (foundProduct) productId = foundProduct._id;
    }

    const product = await Product.findById(productId);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const existingReview = await Review.findOne({ product: productId, user: req.user._id });
    if (existingReview) {
      res.status(400);
      throw new Error('You have already reviewed this product');
    }

    const hasOrdered = await Order.findOne({
      user: req.user._id,
      orderStatus: { $regex: /^delivered$/i },
      'items.product': productId,
    });

    if (!hasOrdered) {
      res.status(403);
      throw new Error('You can only review products from orders that have been delivered to you');
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment,
      image: image || '',
      isApproved: false,
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully and is pending admin approval',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Get all reviews across the platform
// @route   GET /api/reviews/admin/reviews
// @access  Private/Admin
const getAllAdminReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name primaryImage images')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Admin: Update review approval status (Allow/Disallow)
// @route   PUT /api/reviews/admin/reviews/:id
// @access  Private/Admin
const updateReviewStatus = async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    review.isApproved = isApproved !== undefined ? isApproved : review.isApproved;
    await review.save();

    if (typeof Review.calcAverageRatings === 'function') {
      await Review.calcAverageRatings(review.product);
    }

    res.status(200).json({
      success: true,
      message: 'Review status updated successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review (Admin or Owner)
// @route   DELETE /api/reviews/:id OR /api/reviews/admin/reviews/:id
// @access  Private
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      res.status(404);
      throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to delete this review');
    }

    const productId = review.product;
    await review.deleteOne();

    if (typeof Review.calcAverageRatings === 'function') {
      await Review.calcAverageRatings(productId);
    }

    res.status(200).json({
      success: true,
      message: 'Review permanently removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createProductReview,
  getAllAdminReviews,
  updateReviewStatus,
  deleteReview,
};