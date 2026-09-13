const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Helper to format tags into clean lowercased array of strings
const formatTags = (tagsInput) => {
  if (!tagsInput) return [];
  if (Array.isArray(tagsInput)) {
    return tagsInput.map((t) => String(t).trim().toLowerCase()).filter(Boolean);
  }
  if (typeof tagsInput === 'string') {
    return tagsInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
  }
  return [];
};

// @desc    Get all products with Search, Filter, Sort & Pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      inStock,
      featured,
      tag,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    // Handle legacy products where isActive might not exist yet
    const query = {
      $or: [
        { isActive: true },
        { isActive: { $exists: false } }
      ]
    };

    // Flexible Tag Filtering (matches array element or case-insensitive regex)
    if (tag && tag.trim()) {
      const cleanTag = tag.trim().toLowerCase();
      query.tags = { 
        $in: [cleanTag, new RegExp(cleanTag, 'i')] 
      };
    }

    // Keyword Search
    if (search && search.trim() && !tag) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { brand: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ];
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category.toLowerCase() });
        query.category = foundCategory ? foundCategory._id : null;
      }
    }

    if (brand && brand.trim()) {
      query.brand = new RegExp(`^${brand.trim()}$`, 'i');
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined && !isNaN(minPrice)) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice !== undefined && !isNaN(maxPrice)) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (inStock === 'true' || inStock === true) {
      query.stock = { $gt: 0 };
    }

    // Flexible Featured Boolean matching (handles string "true", boolean true, or "1")
    if (featured === 'true' || featured === true || featured === '1') {
      query.featured = true;
    }

    let sortOptions = { createdAt: -1 };

    if (sort) {
      switch (sort) {
        case 'price-asc':
        case 'price_asc':
          sortOptions = { price: 1 };
          break;
        case 'price-desc':
        case 'price_desc':
          sortOptions = { price: -1 };
          break;
        case 'discount':
          sortOptions = { discountPrice: -1 };
          break;
        case 'oldest':
          sortOptions = { createdAt: 1 };
          break;
        case 'rating':
          sortOptions = { rating: -1 };
          break;
        case 'newest':
        default:
          sortOptions = { createdAt: -1 };
          break;
      }
    }

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const pageLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const skip = (currentPage - 1) * pageLimit;

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOptions)
      .skip(skip)
      .limit(pageLimit);

    const totalPages = Math.ceil(totalProducts / pageLimit) || 1;

    res.status(200).json({
      success: true,
      products,
      data: {
        products,
        pagination: {
          currentPage,
          totalPages,
          totalProducts,
          limit: pageLimit,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products helper endpoint
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ 
      featured: true, 
      $or: [{ isActive: true }, { isActive: { $exists: false } }] 
    })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      products,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);

    const product = isObjectId
      ? await Product.findById(id).populate('category', 'name slug')
      : await Product.findOne({ slug: id }).populate('category', 'name slug');

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      images,
      category,
      brand,
      stock,
      featured,
      tags,
      isActive,
    } = req.body;

    if (!name || !description || price === undefined || !category || stock === undefined) {
      res.status(400);
      throw new Error('Please fill in all required fields: name, description, price, category, stock');
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      res.status(404);
      throw new Error('Invalid category specified: Category does not exist');
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      images,
      category,
      brand: brand || 'Generic',
      stock: Number(stock),
      featured: featured === true || featured === 'true' || featured === '1',
      tags: formatTags(tags),
      isActive: isActive !== undefined ? (isActive === true || isActive === 'true' || isActive === '1') : true,
    });

    await product.populate('category', 'name slug');

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);
      if (!categoryExists) {
        res.status(404);
        throw new Error('Invalid category specified: Category does not exist');
      }
    }

    const updatedData = { ...req.body };

    if (updatedData.tags !== undefined) {
      updatedData.tags = formatTags(updatedData.tags);
    }
    if (updatedData.featured !== undefined) {
      updatedData.featured = updatedData.featured === true || updatedData.featured === 'true' || updatedData.featured === '1';
    }
    if (updatedData.isActive !== undefined) {
      updatedData.isActive = updatedData.isActive === true || updatedData.isActive === 'true' || updatedData.isActive === '1';
    }
    if (updatedData.price !== undefined) {
      updatedData.price = Number(updatedData.price);
    }
    if (updatedData.stock !== undefined) {
      updatedData.stock = Number(updatedData.stock);
    }

    Object.assign(product, updatedData);
    await product.save();
    await product.populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};