import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import apiService from '../services/api';

export const useServerCart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchCart = async () => {
    if (!isAuthenticated) return;
    
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

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      setError(null);
      const response = await apiService.addToCart(productId, quantity);
      setCart(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setError(null);
      const response = await apiService.removeFromCart(productId);
      setCart(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      const response = await apiService.clearCart();
      setCart(response);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const getTotalPrice = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    cart,
    loading,
    error,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalPrice,
    getTotalItems,
    refetch: fetchCart,
  };
};