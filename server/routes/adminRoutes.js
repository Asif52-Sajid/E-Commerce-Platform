const express = require('express');
const router = express.Router();
const { protect, requireAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getDashboardStats,
  getRecentOrders,
  getLowStockProducts,
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  uploadProductImages,
  deleteProductImage,
  reorderProductImages,
  updateImageMetadata,
  toggleProductStatus,
  deleteProduct,
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAdminOrders,
  getAdminOrderById,
  deleteOrder,
  updateOrderStatus,
  getAdminInventory,
  updateProductStock,
  getAdminUsers,
  updateUserRole,
  deleteUser,
} = require('../controllers/adminController');

const {
  getAllAdminReviews,
  updateReviewStatus,
  deleteReview: deleteAdminReview,
} = require('../controllers/reviewController');

// Apply authentication and admin protection to all admin routes
router.use(protect);
router.use(requireAdmin);

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/recent-orders', getRecentOrders);
router.get('/dashboard/low-stock', getLowStockProducts);

// Category routes
router.get('/categories', getAdminCategories);
router.post('/categories', createCategory);
router.patch('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Product management routes
router.get('/products', getAdminProducts);
router.get('/products/:id', getAdminProductById);
router.post('/products', createProduct);
router.post('/products/:id/images', upload.array('images', 8), uploadProductImages);
router.patch('/products/:id/images/reorder', reorderProductImages);
router.patch('/products/:id/images/:imageId', updateImageMetadata);
router.delete('/products/:id/images/:imageId', deleteProductImage);
router.patch('/products/:id', updateProduct);
router.patch('/products/:id/toggle-status', toggleProductStatus);
router.delete('/products/:id', deleteProduct);

// Order routes
router.get('/orders', getAdminOrders);
router.get('/orders/:id', getAdminOrderById);
router.patch('/orders/:id/status', updateOrderStatus);
router.delete('/orders/:id', deleteOrder);

// Inventory routes
router.get('/inventory', getAdminInventory);
router.patch('/inventory/:id', updateProductStock);

// User Management routes
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Review Management routes
router.get('/reviews', getAllAdminReviews);
router.put('/reviews/:id', updateReviewStatus);
router.delete('/reviews/:id', deleteAdminReview);

module.exports = router;