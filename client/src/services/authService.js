import api from './api';

// Register a new user
export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Login an existing user
export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

// Fetch current authenticated user session
export const getCurrentUserApi = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Logout user and invalidate session cookie
export const logoutApi = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

export default {
  registerApi,
  loginApi,
  getCurrentUserApi,
  logoutApi,
};