import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartService } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cartData, setCartData] = useState({ items: [], totalItems: 0, subtotal: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch cart from backend API
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartData({ items: [], totalItems: 0, subtotal: 0 });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await cartService.getCart();
      if (res.success) {
        setCartData(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Refetch cart when user authentication status changes
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  // Add product to backend cart
  const addToCart = async (product, quantity = 1) => {
    const productId = typeof product === 'object' ? (product._id || product.id) : product;

    try {
      setLoading(true);
      setError(null);
      const res = await cartService.addToCart(productId, quantity);
      if (res.success) {
        setCartData(res.data);
        return { success: true, message: res.message };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add item to cart';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(productId);
    }

    try {
      setError(null);
      const res = await cartService.updateCartItem(productId, newQuantity);
      if (res.success) {
        setCartData(res.data);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update item quantity';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Remove single item from cart
  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const res = await cartService.removeCartItem(productId);
      if (res.success) {
        setCartData(res.data);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to remove item';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      setLoading(true);
      const res = await cartService.clearCart();
      if (res.success) {
        setCartData(res.data);
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to clear cart';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  // Calculate values safely with fallback numbers
  const cartItems = cartData.items || [];
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.price || item.price || 0;
    const quantity = item.quantity || 1;
    return acc + price * quantity;
  }, 0);

  // Default shipping fee logic (Free over ৳5000, otherwise ৳100 or ৳0)
  const shippingFee = subtotal >= 5000 || subtotal === 0 ? 0 : 100;
  const total = subtotal + shippingFee;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalCount: cartData.totalItems || 0,
        totalPrice: cartData.subtotal || 0,
        subtotal,
        shippingFee,
        total,
        loading,
        error,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};