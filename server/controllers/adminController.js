const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { uploadBufferToCloudinary, deleteCloudinaryAssets } = require('../services/cloudinaryService');

const LOW_STOCK_THRESHOLD = 5;
const MAX_IMAGES_PER_PRODUCT = 8;

// Helper function to convert category names to URL-friendly slugs
const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

// @desc    Get Admin Dashboard Statistics
// @route   GET /api/admin/dashboard/stats
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
    const lowStockProducts = await Product.countDocuments({
      isActive: true,
      stock: { $lte: LOW_STOCK_THRESHOLD },
    });

    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      data: {
        totalProducts,
        totalCategories,
        totalUsers,
        totalOrders,
        pendingOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        lowStockProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Recent Orders for Dashboard
// @route   GET /api/admin/dashboard/recent-orders
// @access  Private/Admin
const getRecentOrders = async (req, res, next) => {
  try {
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: recentOrders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Low Stock Products Widget Data
// @route   GET /api/admin/dashboard/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res, next) => {
  try {
    const lowStock = await Product.find({
      isActive: true,
      stock: { $lte: LOW_STOCK_THRESHOLD },
    })
      .select('name stock category price')
      .populate('category', 'name')
      .limit(5);

    res.status(200).json({
      success: true,
      data: lowStock,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories for Admin (includes count of associated products)
// @route   GET /api/admin/categories
// @access  Private/Admin
const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const productCount = await Product.countDocuments({ category: cat._id });
        return {
          ...cat.toObject(),
          productCount,
        };
      })
    );

    res.status(200).json({ success: true, data: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Category name is required');
    }

    const slug = slugify(name);
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      res.status(400);
      throw new Error('Category with this name or slug already exists');
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
    });

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing category
// @route   PATCH /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res, next) => {
  try {
    const { name, description, image, isActive } = req.body;

    let category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    if (name && name !== category.name) {
      const slug = slugify(name);
      const existing = await Category.findOne({ _id: { $ne: req.params.id }, slug });
      if (existing) {
        res.status(400);
        throw new Error('Category name/slug already in use');
      }
      category.name = name;
      category.slug = slug;
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = Boolean(isActive);

    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category (Checks for associated products first)
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    const associatedProducts = await Product.countDocuments({ category: category._id });
    if (associatedProducts > 0) {
      res.status(400);
      throw new Error(
        `Cannot delete category. It has ${associatedProducts} linked product(s). Reassign or remove products first.`
      );
    }

    await category.deleteOne();

    res.status(200).json({ success: true, message: 'Category removed successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products for Admin (Paginated, Searchable, Filterable)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAdminProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, status } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID for Admin
// @route   GET /api/admin/products/:id
// @access  Private/Admin
const getAdminProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, images } = req.body;

    if (!name || price === undefined || stock === undefined || !category) {
      res.status(400);
      throw new Error('Please provide name, price, stock, and category');
    }

    if (price < 0 || stock < 0) {
      res.status(400);
      throw new Error('Price and stock must be non-negative values');
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(404);
      throw new Error('Category not found');
    }

    const product = await Product.create({
      name,
      description: description || '',
      price: Number(price),
      category,
      stock: Number(stock),
      images: images || [],
      isActive: true,
    });

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update existing product
// @route   PATCH /api/admin/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    const { name, description, price, category, stock, isActive, images } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (price !== undefined && price < 0) {
      res.status(400);
      throw new Error('Price cannot be negative');
    }

    if (stock !== undefined && stock < 0) {
      res.status(400);
      throw new Error('Stock cannot be negative');
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        res.status(404);
        throw new Error('Category not found');
      }
      product.category = category;
    }

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (stock !== undefined) product.stock = Number(stock);
    if (isActive !== undefined) product.isActive = Boolean(isActive);
    if (images !== undefined) product.images = images;

    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product images (Admin)
// @route   POST /api/admin/products/:id/images
// @access  Private/Admin
const uploadProductImages = async (req, res) => {
  const { id: productId } = req.params;
  const uploadedPublicIds = [];

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files provided' });
    }

    const existingCount = product.images ? product.images.length : 0;
    const newCount = req.files.length;

    if (existingCount + newCount > MAX_IMAGES_PER_PRODUCT) {
      return res.status(400).json({
        message: `Upload rejected. Maximum limit is ${MAX_IMAGES_PER_PRODUCT} images per product. Current: ${existingCount}, Attempted to add: ${newCount}.`,
      });
    }

    const uploadPromises = req.files.map((file) => uploadBufferToCloudinary(file.buffer, productId));
    const uploadResults = await Promise.all(uploadPromises);

    uploadResults.forEach((result) => uploadedPublicIds.push(result.publicId));

    const startPosition = existingCount;
    const newImageObjects = uploadResults.map((result, index) => ({
      url: result.url,
      publicId: result.publicId,
      altText: req.body.altText || product.name,
      position: startPosition + index,
      isPrimary: existingCount === 0 && index === 0,
    }));

    product.images.push(...newImageObjects);
    await product.save();

    return res.status(200).json({
      message: 'Images uploaded successfully',
      images: product.images,
    });
  } catch (error) {
    if (uploadedPublicIds.length > 0) {
      await deleteCloudinaryAssets(uploadedPublicIds);
    }

    return res.status(500).json({
      message: 'Failed to upload product images',
      error: error.message,
    });
  }
};

// @desc    Delete a specific product image (Admin)
// @route   DELETE /api/admin/products/:id/images/:imageId
// @access  Private/Admin
const deleteProductImage = async (req, res) => {
  const { id: productId, imageId } = req.params;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const targetImage = product.images.id(imageId);
    if (!targetImage) {
      return res.status(404).json({ message: 'Image not found on this product' });
    }

    if (targetImage.publicId && !targetImage.publicId.startsWith('legacy_')) {
      try {
        await cloudinary.uploader.destroy(targetImage.publicId);
      } catch (cloudErr) {
        console.error(`Failed to delete asset ${targetImage.publicId} from Cloudinary:`, cloudErr.message);
      }
    }

    const wasPrimary = targetImage.isPrimary;

    product.images.pull({ _id: imageId });

    product.images.forEach((img, index) => {
      img.position = index;
    });

    if (wasPrimary && product.images.length > 0) {
      product.images[0].isPrimary = true;
    }

    await product.save();

    return res.status(200).json({
      message: 'Product image deleted successfully',
      images: product.images,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to delete product image',
      error: error.message,
    });
  }
};

// @desc    Reorder product images and set primary image
// @route   PATCH /api/admin/products/:id/images/reorder
// @access  Private/Admin
const reorderProductImages = async (req, res) => {
  const { id: productId } = req.params;
  const { imageOrder, primaryImageId } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!Array.isArray(imageOrder) || imageOrder.length === 0) {
      return res.status(400).json({ message: 'Invalid or empty image order array' });
    }

    const imageMap = new Map();
    product.images.forEach((img) => imageMap.set(img._id.toString(), img));

    const reorderedImages = [];
    imageOrder.forEach((imageId, index) => {
      const img = imageMap.get(imageId.toString());
      if (img) {
        img.position = index;
        img.isPrimary = primaryImageId
          ? img._id.toString() === primaryImageId.toString()
          : index === 0;
        reorderedImages.push(img);
      }
    });

    product.images.forEach((img) => {
      if (!imageOrder.includes(img._id.toString())) {
        img.position = reorderedImages.length;
        img.isPrimary = false;
        reorderedImages.push(img);
      }
    });

    product.images = reorderedImages;
    await product.save();

    return res.status(200).json({
      message: 'Product images reordered successfully',
      images: product.images,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to reorder product images',
      error: error.message,
    });
  }
};

// @desc    Update image metadata (altText, isPrimary)
// @route   PATCH /api/admin/products/:id/images/:imageId
// @access  Private/Admin
const updateImageMetadata = async (req, res) => {
  const { id: productId, imageId } = req.params;
  const { altText, isPrimary } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const targetImage = product.images.id(imageId);
    if (!targetImage) {
      return res.status(404).json({ message: 'Image not found on this product' });
    }

    if (altText !== undefined) {
      targetImage.altText = altText;
    }

    if (isPrimary === true) {
      product.images.forEach((img) => {
        img.isPrimary = img._id.toString() === imageId;
      });
    }

    await product.save();

    return res.status(200).json({
      message: 'Image metadata updated successfully',
      images: product.images,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to update image metadata',
      error: error.message,
    });
  }
};

// @desc    Deactivate or Soft Delete product
// @route   PATCH /api/admin/products/:id/toggle-status
// @access  Private/Admin
const toggleProductStatus = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.isActive = !product.isActive;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product completely (Hard delete & Cloudinary assets cleanup)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const publicIds = product.images
      .map((img) => img.publicId)
      .filter((id) => id && !id.startsWith('legacy_'));

    if (publicIds.length > 0) {
      await deleteCloudinaryAssets(publicIds);
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted completely',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for Admin (Paginated & Filterable by status and flexible search)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAdminOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, search } = req.query;

    let query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (search && search.trim() !== '') {
      const cleanSearch = search.trim().replace(/^#/, '');
      const searchRegex = new RegExp(cleanSearch, 'i');

      const matchingUsers = await User.find({
        $or: [{ name: searchRegex }, { email: searchRegex }],
      }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);

      const searchConditions = [
        { orderNumber: searchRegex },
        { 'shippingAddress.name': searchRegex },
        { 'shippingAddress.phone': searchRegex },
        { 'shippingAddress.email': searchRegex },
      ];

      if (userIds.length > 0) {
        searchConditions.push({ user: { $in: userIds } });
      }

      if (/^[0-9a-fA-F]{24}$/.test(cleanSearch)) {
        searchConditions.push({ _id: cleanSearch });
      }

      query.$or = searchConditions;
    }

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order details for Admin
// @route   GET /api/admin/orders/:id
// @access  Private/Admin
const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price images');

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete order completely
// @route   DELETE /api/admin/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status & handle stock restoration on cancellation
// @route   PATCH /api/admin/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      res.status(400);
      throw new Error('Invalid order status supplied');
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    const previousStatus = order.orderStatus;

    if (orderStatus === 'cancelled' && previousStatus !== 'cancelled') {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: item.quantity },
          });
        }
      }
    }

    if (previousStatus === 'cancelled' && orderStatus !== 'cancelled') {
      for (const item of order.items) {
        if (item.product) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          });
        }
      }
    }

    order.orderStatus = orderStatus;

    if (orderStatus === 'delivered') {
      order.isPaid = true;
      order.paidAt = order.paidAt || Date.now();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Inventory list with stock filter
// @route   GET /api/admin/inventory
// @access  Private/Admin
const getAdminInventory = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { stockFilter, search, threshold = 5 } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search.trim(), $options: 'i' };
    }

    if (stockFilter === 'out') {
      query.stock = 0;
    } else if (stockFilter === 'low') {
      query.stock = { $gt: 0, $lte: Number(threshold) };
    } else if (stockFilter === 'in') {
      query.stock = { $gt: Number(threshold) };
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .select('name price stock isActive category updatedAt')
      .sort({ stock: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Quick update stock quantity for a single product
// @route   PATCH /api/admin/inventory/:id
// @access  Private/Admin
const updateProductStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || Number(stock) < 0) {
      res.status(400);
      throw new Error('Stock quantity must be a non-negative number');
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product.stock = Number(stock);
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all registered users (Paginated & Searchable)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, role } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role (user <-> admin)
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      res.status(400);
      throw new Error('Invalid role specified. Allowed roles: user, admin');
    }

    if (req.user._id.toString() === req.params.id && role !== 'admin') {
      res.status(400);
      throw new Error('You cannot remove your own administrative privileges');
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      res.status(404);
      throw new Error('User not found');
    }

    targetUser.role = role;
    await targetUser.save();

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      data: {
        _id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      res.status(400);
      throw new Error('You cannot delete your own admin account');
    }

    const targetUser = await User.findById(req.params.id);
    if (!targetUser) {
      res.status(404);
      throw new Error('User not found');
    }

    await targetUser.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
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
};