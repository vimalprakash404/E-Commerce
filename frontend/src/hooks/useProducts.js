import { useState, useEffect } from 'react';
import apiService from '../services/api';

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });

  const fetchProducts = async (searchParams = params) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products with params:', searchParams);
      const response = await apiService.getProducts(searchParams);
      console.log('Products response:', response);
      setProducts(response.products || []);
      setPagination({
        total: response.total || 0,
        page: response.page || 1,
        pages: response.pages || 1,
      });
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('useProducts effect triggered with params:', params);
    fetchProducts(params);
  }, []);

  const refetch = (newParams = {}) => {
    fetchProducts({ ...params, ...newParams });
  };

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
  };
};

export const useProduct = (id) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getProduct(id);
        setProduct(response);
      } catch (err) {
        setError(err.message);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};