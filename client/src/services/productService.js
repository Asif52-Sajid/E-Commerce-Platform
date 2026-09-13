import api from './api';

export const productService = {
  // Fetch products with optional search, filtering, category, sorting, & pagination
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    // Server returns response.data = { success: true, data: { products, pagination } }
    const serverPayload = response.data?.data || {};
    return {
      products: serverPayload.products || [],
      pagination: serverPayload.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalProducts: 0,
        limit: 12,
      },
    };
  },

  // Fetch product categories dynamically
  getCategories: async () => {
    const response = await api.get('/categories');
    const serverPayload = response.data?.data || response.data || [];
    return Array.isArray(serverPayload) ? serverPayload : serverPayload.categories || [];
  },

  // Fetch a single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    // Server returns response.data = { success: true, data: product }
    return response.data?.data || null;
  },

  // Fetch featured products for home page / sliders
  getFeaturedProducts: async () => {
    const response = await api.get('/products', { params: { featured: 'true', limit: 8 } });
    const serverPayload = response.data?.data || {};
    return serverPayload.products || [];
  },

  // Search suggestions auto-complete query
  getSearchSuggestions: async (query) => {
    const response = await api.get('/products', { params: { search: query, limit: 6 } });
    const serverPayload = response.data?.data || {};
    return serverPayload.products || [];
  },

  // Delete a product by ID (Admin)[cite: 1]
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export default productService;