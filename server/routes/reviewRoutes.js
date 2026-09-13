const express = require('express');
const router = express.Router();
const {
  getProductReviews,
  createProductReview,
  getAllAdminReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, requireAdmin } = require('../middleware/authMiddleware');

// Public: Get approved reviews for a specific product
router.get('/product/:productId', getProductReviews);

// User Protected: Create a review for a specific product
router.post('/:productId', protect, createProductReview);

// Admin Moderation Routes
router.get('/admin/reviews', protect, requireAdmin, getAllAdminReviews);
router.put('/admin/reviews/:id', protect, requireAdmin, updateReviewStatus);
router.delete('/admin/reviews/:id', protect, requireAdmin, deleteReview);

// Standard delete route for users/admin
router.delete('/:id', protect, deleteReview);

module.exports = router;