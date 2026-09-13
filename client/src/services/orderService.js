import api from './api';

export const orderService = {
  // Place a new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // Get logged-in user's order history
  getMyOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // Get order details by ID
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // Cancel pending order
  cancelOrder: async (id) => {
    const response = await api.put(`/orders/${id}/cancel`);
    return response.data;
  },
};

export default orderService;