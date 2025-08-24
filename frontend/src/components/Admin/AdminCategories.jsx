import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Upload } from 'lucide-react';
import apiService from '../../services/api';
import CategoryForm from './CategoryForm';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCategories({ includeInactive: true });
      setCategories(response || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await apiService.deleteCategory(categoryId);
        setCategories(categories.filter(c => c._id !== categoryId));
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryForm(true);
  };

  const handleCategorySaved = (savedCategory) => {
    if (editingCategory) {
      setCategories(categories.map(c => c._id === savedCategory._id ? savedCategory : c));
    } else {
      setCategories([savedCategory, ...categories]);
    }
    setShowCategoryForm(false);
    setEditingCategory(null);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="admin-loading">Loading categories...</div>;
  }

  return (
    <div className="admin-categories">
      <div className="admin-categories-header">
        <h2>Category Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowCategoryForm(true)}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <div className="admin-categories-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-categories-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Description</th>
              <th>Parent Category</th>
              <th>Products</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map(category => (
              <tr key={category._id}>
                <td>
                  <div className="category-image-cell">
                    <img 
                      src={category.image?.url || '/api/placeholder/60/60'} 
                      alt={category.name}
                    />
                  </div>
                </td>
                <td>
                  <div className="category-name-cell">
                    <h4>{category.name}</h4>
                    <p>{category.slug}</p>
                  </div>
                </td>
                <td>
                  <p className="category-description">
                    {category.description || 'No description'}
                  </p>
                </td>
                <td>
                  {category.parentCategory ? (
                    <span className="parent-category-badge">
                      {category.parentCategory.name}
                    </span>
                  ) : (
                    <span className="parent-category-badge root">Root</span>
                  )}
                </td>
                <td>
                  <span className="product-count-badge">
                    {category.productCount || 0}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                    {category.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon"
                      onClick={() => handleEditCategory(category)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDeleteCategory(category._id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showCategoryForm && (
        <CategoryForm
          category={editingCategory}
          categories={categories}
          onSave={handleCategorySaved}
          onCancel={() => {
            setShowCategoryForm(false);
            setEditingCategory(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminCategories;