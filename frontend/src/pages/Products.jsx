import React, { useState } from 'react';
import { products, categories } from '../data/products';
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
  const [searchQuery, setSearchQuery] = useState(''); // <-- Add search state

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', product });
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setCurrentView('product-detail');
  };

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()); // <-- Search filter
      return matchesCategory && matchesPrice && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        default: return a.name.localeCompare(b.name);
      }
    });

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
          searchQuery={searchQuery} // <-- Pass search props
          setSearchQuery={setSearchQuery} // <-- Pass search props
        />

        <ResultsInfo count={filteredProducts.length} />

        {/* Product Grid/List */}
        <ProductGrid 
          products={filteredProducts}
          viewMode={viewMode}
          onViewProduct={handleViewProduct}
          onAddToCart={handleAddToCart}
        />

        {filteredProducts.length === 0 && (
          <div className="no-results">
            <p>No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
