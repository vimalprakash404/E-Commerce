import React, { useState, useEffect } from 'react';
import { useApp } from "../../context/AppContext.jsx";
import apiService from '../../services/api';

export default function CategoryFilters() {
  const { selectedCategory, setSelectedCategory } = useApp();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="category-filters">
      <button
        className={selectedCategory === "all" ? "active" : ""}
        onClick={() => setSelectedCategory("all")}
      >
        All Products
      </button>
      {categories.map((category) => (
        <button
          key={category._id}
          className={selectedCategory === category.slug ? "active" : ""}
          onClick={() => setSelectedCategory(category.slug)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
