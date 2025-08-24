import React, { useState, useEffect } from 'react';
import { categories } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import ProductFilters from '../components/Product/ProductFilters';
import ProductCard from '../components/Product/ProductCard';
import ResultsInfo from '../components/Product/ResultsInfo';
import { useNavigate } from 'react-router-dom';

const ProductList = () => {
  const { addToCart } = useCart();
  const { setSelectedProduct } = useApp();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState('');

  const { products, loading, error, refetch } = useProducts({
    search: searchQuery || undefined,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
    limit: 100 // Increase limit to show more products
  });

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    navigate('/product-details');
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      refetch({
        search: searchQuery || undefined,
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        limit: 100
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, priceRange]);

  const sortedProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': 
          return (a.price || 0) - (b.price || 0);
        case 'price-high': 
          return (b.price || 0) - (a.price || 0);
        case 'rating': 
          return (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0);
        default: 
          return (a.name || '').localeCompare(b.name || '');
      }
    });
  }, [products, sortBy]);

  return (
    <div className="product-list-page">
      <div className="product-list-header">
        <h1>Our Products</h1>
        <p>Discover our amazing collection of products</p>
      </div>

      <div className="product-list-container">
        {/* Filters + Results Info */}
        <ProductFilters 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          categories={categories}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        <ResultsInfo count={sortedProducts.length} />

        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Loading products...
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>
            Error: {error}
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && (
          <div className={`products-container ${viewMode}`}>
            {sortedProducts.map(product => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                onViewProduct={() => handleViewProduct(product)}
                onAddToCart={() => handleAddToCart(product)}
              />
            ))}
          </div>
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <div className="no-results">
            <p>No products found matching your criteria.</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setPriceRange([0, 500]);
              }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;