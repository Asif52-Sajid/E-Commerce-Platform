import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistService } from '../services/wishlistService';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistData, setWishlistData] = useState({ products: [], totalItems: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch wishlist from backend API
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistData({ products: [], totalItems: 0 });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await wishlistService.getWishlist();
      if (res.success) {
        setWishlistData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Check if a product is in wishlist
  const isInWishlist = (productId) => {
    if (!productId || !wishlistData.products) return false;
    const targetId = typeof productId === 'object' ? (productId._id || productId.id) : productId;
    return wishlistData.products.some((product) => (product._id || product.id) === targetId);
  };

  // Toggle wishlist item (Add if absent, Remove if present)
  const toggleWishlist = async (product) => {
    const productId = typeof product === 'object' ? (product._id || product.id) : product;

    if (isInWishlist(productId)) {
      return removeFromWishlist(productId);
    } else {
      return addToWishlist(productId);
    }
  };

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    try {
      setError(null);
      const res = await wishlistService.addToWishlist(productId);
      if (res.success) {
        setWishlistData(res.data);
        return { success: true, message: res.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to wishlist';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      setError(null);
      const res = await wishlistService.removeFromWishlist(productId);
      if (res.success) {
        setWishlistData(res.data);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove from wishlist';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.clearWishlist();
      if (res.success) {
        setWishlistData(res.data);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to clear wishlist';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: wishlistData.products,
        totalWishlistCount: wishlistData.totalItems || 0,
        loading,
        error,
        fetchWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};