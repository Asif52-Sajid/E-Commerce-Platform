import api from './api';

export const wishlistService = {
  // Get current user's wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add product to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post(`/wishlist/${productId}`);
    return response.data;
  },

  // Remove product from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  // Clear entire wishlist
  clearWishlist: async () => {
    const response = await api.delete('/wishlist');
    return response.data;
  },
};

export default wishlistService;