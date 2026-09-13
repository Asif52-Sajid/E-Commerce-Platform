const cloudinary = require('../config/cloudinary');

/**
 * Validates Cloudinary API connection on server boot
 */
const verifyCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    if (result.status === 'ok') {
      console.log('✅ Cloudinary SDK connected successfully');
      return true;
    }
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

module.exports = verifyCloudinaryConnection;