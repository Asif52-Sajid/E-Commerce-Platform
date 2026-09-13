/**
 * Appends Cloudinary transformation parameters to image URLs
 * @param {string} url - Original Cloudinary secure URL
 * @param {object} options - Transformation options (width, quality, format)
 */
export const getOptimizedImageUrl = (url, { width = 800, quality = 'auto', format = 'auto' } = {}) => {
  if (!url || typeof url !== 'string') return '/placeholder-product.png';
  if (!url.includes('cloudinary.com')) return url;

  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;

  const transformation = `upload/f_${format},q_${quality},w_${width}/`;
  return url.replace('/upload/', `/${transformation}`);
};