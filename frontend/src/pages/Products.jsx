import React, { useState } from 'react';
import { categories } from '../data/products';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import ProductFilters from '../components/Product/ProductFilters';
import ProductGrid from '../components/Product/ProductTile.jsx';
import ResultsInfo from '../components/Product/ResultsInfo';

const ProductList = () => {
  const { dispatch } = useCart();
  const { setCurrentView, setSelectedProduct } = useApp();

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState('');

  const { products, loading, error, refetch } = useProducts({
    search: searchQuery,
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    minPrice: priceRange[0],
    maxPrice: priceRange[1],
  });

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const handleFilterChange = () => {
    refetch({
      search: searchQuery,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
    });
  };

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleFilterChange();
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, priceRange]);

  const sortedProducts = React.useMemo(() => {
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return (b.averageRating || 0) - (a.averageRating || 0);
        default: return a.name.localeCompare(b.name);
      }
    });
  }, [products, sortBy]);

  return (
    <div className="product-list-page">
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
        {/* Product Grid/List */}
        {!loading && !error && (
          <ProductGrid 
            products={sortedProducts}
            viewMode={viewMode}
            onViewProduct={handleViewProduct}
            onAddToCart={handleAddToCart}
          />
        )}

        {!loading && !error && sortedProducts.length === 0 && (
          <div className="no-results">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
