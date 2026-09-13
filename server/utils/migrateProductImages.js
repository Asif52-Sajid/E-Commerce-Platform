const Product = require('../models/Product');

/**
 * Migration script to update legacy string image arrays to structured image objects
 */
const migrateProductImages = async () => {
  try {
    const products = await Product.find({});
    let migratedCount = 0;

    for (const product of products) {
      if (Array.isArray(product.images) && product.images.length > 0) {
        let needsSave = false;

        const updatedImages = product.images.map((img, index) => {
          // If image entry is legacy string URL
          if (typeof img === 'string') {
            needsSave = true;
            return {
              url: img,
              publicId: `legacy_${product._id}_${index}`,
              altText: product.name,
              position: index,
              isPrimary: index === 0,
            };
          }
          return img;
        });

        if (needsSave) {
          product.images = updatedImages;
          await product.save();
          migratedCount++;
        }
      }
    }

    console.log(`✅ Product image schema migration complete. Updated ${migratedCount} products.`);
  } catch (error) {
    console.error('❌ Product image schema migration failed:', error.message);
  }
};

module.exports = migrateProductImages;