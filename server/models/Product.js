const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    publicId: {
      type: String,
      required: [true, 'Cloudinary public ID is required'],
    },
    altText: {
      type: String,
      default: '',
      trim: true,
    },
    position: {
      type: Number,
      default: 0,
    },
    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      default: 0,
      min: [0, 'Discount price must not be negative'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    brand: {
      type: String,
      trim: true,
      default: 'Generic',
    },
    stock: {
      type: Number,
      required: [true, 'Stock count is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    images: {
      type: [imageSchema],
      default: [],
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
    numReviews: {
      type: Number,
      min: [0, 'Number of reviews cannot be negative'],
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
      lowercase: true,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// High-Performance Indexes for Filtering, Sorting, and Search
productSchema.index({ isActive: 1, category: 1, price: 1 });
productSchema.index({ isActive: 1, featured: -1, createdAt: -1 });
productSchema.index({ name: 'text', brand: 'text', tags: 'text' });

// Virtual helper to return primary or first image URL cleanly
productSchema.virtual('primaryImage').get(function () {
  if (!this.images || this.images.length === 0) {
    return { url: '', altText: this.name || 'Product Image', publicId: '' };
  }
  const primary = this.images.find((img) => img.isPrimary);
  return primary || this.images[0];
});

// Async Pre-Save Hook to generate slug automatically from product name
productSchema.pre('save', async function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

module.exports = mongoose.model('Product', productSchema);