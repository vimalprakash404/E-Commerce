import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart from server
  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCart({ items: [] });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCart();
      setCart(response);
    } catch (err) {
      setError(err.message);
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  // Load cart when authentication status changes
  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  // Add item to cart
  const addToCart = async (product) => {
    if (!isAuthenticated) {
      setError('Please login to add items to cart');
      return;
    }

    try {
      setError(null);
      const response = await apiService.addToCart(product.id || product._id, 1);
      setCart(response);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    if (!isAuthenticated) return;

    try {
      setError(null);
      const response = await apiService.removeFromCart(productId);
      setCart(response);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update quantity (for now, we'll remove and re-add)
  const updateQuantity = async (productId, newQuantity) => {
    if (!isAuthenticated || newQuantity <= 0) return;

    try {
      setError(null);
      // Remove item first
      await apiService.removeFromCart(productId);
      // Add back with new quantity
      const response = await apiService.addToCart(productId, newQuantity);
      setCart(response);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!isAuthenticated) return;

    try {
      setError(null);
      const response = await apiService.clearCart();
      setCart(response);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Calculate total price
  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      const price = item.product?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  // Calculate total items
  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Legacy dispatch function for backward compatibility
  const dispatch = async (action) => {
    switch (action.type) {
      case 'ADD_TO_CART':
        await addToCart(action.product);
        break;
      case 'REMOVE_FROM_CART':
        await removeFromCart(action.productId);
        break;
      case 'UPDATE_QUANTITY':
        await updateQuantity(action.productId, action.quantity);
        break;
      case 'CLEAR_CART':
        await clearCart();
        break;
      default:
        break;
    }
  };

  const value = {
    items: cart.items,
    cart,
    loading,
    error,
    dispatch,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refetch: fetchCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};