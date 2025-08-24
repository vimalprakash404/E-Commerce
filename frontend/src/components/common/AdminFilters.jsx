import React from 'react';
import { Search } from 'lucide-react';

const AdminFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  searchPlaceholder = "Search...",
  filters = [],
  children 
}) => {
  return (
    <div className="admin-filters">
      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filters.map((filter, index) => (
        <select
          key={index}
          value={filter.value}
          onChange={(e) => filter.onChange(e.target.value)}
        >
          {filter.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ))}
      
      {children}
    </div>
  );
};

export default AdminFilters;