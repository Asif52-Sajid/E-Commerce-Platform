import api from './api';

// Image Management Functions
export const uploadProductImages = async (productId, formData, onProgress) => {
  const response = await api.post(`/admin/products/${productId}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

export const deleteProductImage = async (productId, imageId) => {
  const response = await api.delete(`/admin/products/${productId}/images/${imageId}`);
  return response.data;
};

export const reorderProductImages = async (productId, imageOrder, primaryImageId) => {
  const response = await api.patch(`/admin/products/${productId}/images/reorder`, {
    imageOrder,
    primaryImageId,
  });
  return response.data;
};

export const updateImageMetadata = async (productId, imageId, metadata) => {
  const response = await api.patch(`/admin/products/${productId}/images/${imageId}`, metadata);
  return response.data;
};

const adminService = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  },
  getRecentOrders: async () => {
    const response = await api.get('/admin/dashboard/recent-orders');
    return response.data;
  },
  getLowStockProducts: async () => {
    const response = await api.get('/admin/dashboard/low-stock');
    return response.data;
  },

  // Products
  getAdminProducts: async (params = {}) => {
    const response = await api.get('/admin/products', { params });
    return response.data;
  },
  getAdminProductById: async (id) => {
    const response = await api.get(`/admin/products/${id}`);
    return response.data;
  },
  createProduct: async (productData) => {
    const response = await api.post('/admin/products', productData);
    return response.data;
  },
  updateProduct: async (id, productData) => {
    const response = await api.patch(`/admin/products/${id}`, productData);
    return response.data;
  },
  toggleProductStatus: async (id) => {
    const response = await api.patch(`/admin/products/${id}/toggle-status`);
    return response.data;
  },
  deleteProduct: async (id) => {
    const response = await api.delete(`/admin/products/${id}`);
    return response.data;
  },

  // Product Images
  uploadProductImages,
  deleteProductImage,
  reorderProductImages,
  updateImageMetadata,

  // Public Categories (helper for product category dropdown)
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  // Admin Categories Management
  getAdminCategories: async () => {
    const response = await api.get('/admin/categories');
    return response.data;
  },
  createCategory: async (categoryData) => {
    const response = await api.post('/admin/categories', categoryData);
    return response.data;
  },
  updateCategory: async (id, categoryData) => {
    const response = await api.patch(`/admin/categories/${id}`, categoryData);
    return response.data;
  },
  deleteCategory: async (id) => {
    const response = await api.delete(`/admin/categories/${id}`);
    return response.data;
  },

  // Admin Orders Management
  getAdminOrders: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },
  getAdminOrderById: async (id) => {
    const response = await api.get(`/admin/orders/${id}`);
    return response.data;
  },
  updateOrderStatus: async (id, orderStatus) => {
    const response = await api.patch(`/admin/orders/${id}/status`, { orderStatus });
    return response.data;
  },
  deleteOrder: async (id) => {
    const response = await api.delete(`/admin/orders/${id}`);
    return response.data;
  },

  // Admin Inventory Management
  getAdminInventory: async (params = {}) => {
    const response = await api.get('/admin/inventory', { params });
    return response.data;
  },
  updateProductStock: async (id, stock) => {
    const response = await api.patch(`/admin/inventory/${id}`, { stock });
    return response.data;
  },

  // Admin User Management
  getAdminUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },
  updateUserRole: async (id, role) => {
    const response = await api.patch(`/admin/users/${id}/role`, { role });
    return response.data;
  },
  deleteUser: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
};

export default adminService;