import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  registerApi, 
  loginApi, 
  logoutApi, 
  getCurrentUserApi 
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Helper to extract user object safely from backend response formats
  const extractUser = (resData) => {
    if (!resData) return null;
    return resData.data || resData.user || resData;
  };

  // Restore session on initial application mount
  const checkAuthStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getCurrentUserApi();
      const currentUser = extractUser(response);
      setUser(currentUser);
    } catch (error) {
      // 401 Unauthorized is expected if user is guest or token expired
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const response = await loginApi(credentials);
      const authenticatedUser = extractUser(response);
      setUser(authenticatedUser);
      return authenticatedUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await registerApi(userData);
      const registeredUser = extractUser(response);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    register,
    logout,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;