const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Uploads a file buffer directly to Cloudinary
 */
const uploadBufferToCloudinary = (fileBuffer, productId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `ecommerce/products/${productId}`,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

/**
 * Deletes multiple Cloudinary assets by public IDs (used for rollbacks)
 */
const deleteCloudinaryAssets = async (publicIds) => {
  if (!publicIds || publicIds.length === 0) return;
  try {
    await Promise.all(publicIds.map((id) => cloudinary.uploader.destroy(id)));
  } catch (error) {
    console.error('Failed to cleanup Cloudinary assets during rollback:', error.message);
  }
};

module.exports = {
  uploadBufferToCloudinary,
  deleteCloudinaryAssets,
};