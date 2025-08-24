import React from 'react';
import { Grid, List, Search } from 'lucide-react';

const ProductFilters = ({
  selectedCategory, setSelectedCategory,
  sortBy, setSortBy,
  viewMode, setViewMode,
  priceRange, setPriceRange,
  categories,
  searchQuery, setSearchQuery // <-- Add these props
}) => {
  return (
    <div className="product-list-controls sticky-filter compact-filters">
      <div className="filter-controls">

        {/* Search Bar */}
        <div className="search-box" style={{ position: 'relative', minWidth: '200px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category.id} value={category.slug}>{category.name}</option>
          ))}
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Highest Rated</option>
        </select>

        <div className="view-toggle">
          <button className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>
            <Grid size={16} />
          </button>
          <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>
            <List size={16} />
          </button>
        </div>

        <div className="price-filter">
          <label>₹{priceRange[0]} - ${priceRange[1]}</label>
          <input
            type="range"
            min="0"
            max="500"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductFilters;
