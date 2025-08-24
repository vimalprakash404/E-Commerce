import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Upload } from 'lucide-react';
import apiService from '../../services/api';
import CategoryForm from './CategoryForm';
import AdminTable from '../common/AdminTable';
import AdminFilters from '../common/AdminFilters';

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

  const columns = [
    {
      header: 'Image',
      key: 'image',
      render: (category) => (
        <div className="category-image-cell">
          <img 
            src={category.image?.url || '/api/placeholder/60/60'} 
            alt={category.name}
          />
        </div>
      )
    },
    {
      header: 'Name',
      key: 'name',
      render: (category) => (
        <div className="category-name-cell">
          <h4>{category.name}</h4>
          <p>{category.slug}</p>
        </div>
      )
    },
    {
      header: 'Description',
      key: 'description',
      render: (category) => (
        <p className="category-description">
          {category.description || 'No description'}
        </p>
      )
    },
    {
      header: 'Parent Category',
      key: 'parentCategory',
      render: (category) => (
        category.parentCategory ? (
          <span className="parent-category-badge">
            {category.parentCategory.name}
          </span>
        ) : (
          <span className="parent-category-badge root">Root</span>
        )
      )
    },
    {
      header: 'Products',
      key: 'productCount',
      render: (category) => (
        <span className="product-count-badge">
          {category.productCount || 0}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (category) => (
        <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
          {category.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

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

      <AdminFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search categories..."
      />

      <AdminTable
        columns={columns}
        data={filteredCategories}
        onEdit={handleEditCategory}
        onDelete={(category) => handleDeleteCategory(category._id)}
        loading={loading}
        emptyMessage="No categories found"
      />

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