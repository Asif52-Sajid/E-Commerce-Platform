import api from './api';

export const reviewService = {
  getReviews: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  },

  createReview: async (productId, reviewData) => {
    const response = await api.post(`/reviews/${productId}`, reviewData);
    return response.data;
  },

  getAllAdminReviews: async () => {
    const response = await api.get('/reviews/admin/reviews');
    return response.data;
  },

  updateReviewStatus: async (reviewId, statusData) => {
    const response = await api.put(`/reviews/admin/reviews/${reviewId}`, statusData);
    return response.data;
  },

  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/admin/reviews/${reviewId}`);
    return response.data;
  }
};