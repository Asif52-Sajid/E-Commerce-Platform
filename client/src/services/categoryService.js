import api from './api';

export const categoryService = {
  // Fetch all categories
  getCategories: async () => {
    const response = await api.get('/categories');
    // Extracts array from response.data.data if nested, or response.data if direct array
    return Array.isArray(response.data)
      ? response.data
      : response.data?.data || [];
  },

  // Fetch category details
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data?.data || response.data;
  },
};

export default categoryService;