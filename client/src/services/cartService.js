import api from './api';

export const cartService = {
  // Get current user's cart
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // Add product to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  // Update quantity of an item in cart
  updateCartItem: async (productId, quantity) => {
    const response = await api.patch(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeCartItem: async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  // Clear entire cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};

export default cartService;