import React, { useState, useRef } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import apiService from '../../services/api';

const CategoryForm = ({ category, categories, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    parentCategory: category?.parentCategory?._id || '',
    isActive: category?.isActive !== undefined ? category.isActive : true,
    sortOrder: category?.sortOrder || 0,
  });
  
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage({
          file,
          preview: e.target.result,
          isNew: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.parentCategory === category?._id) {
      newErrors.parentCategory = 'Category cannot be its own parent';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== '') {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (image && image.isNew) {
        formDataToSend.append('image', image.file);
      }
      
      let savedCategory;
      if (category) {
        savedCategory = await apiService.updateCategory(category._id, formDataToSend);
      } else {
        savedCategory = await apiService.createCategory(formDataToSend);
      }
      
      onSave(savedCategory);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter out current category and its descendants from parent options
  const availableParentCategories = categories.filter(cat => {
    if (!category) return cat._id !== formData.parentCategory;
    return cat._id !== category._id && cat.parentCategory?._id !== category._id;
  });

  return (
    <div className="modal-overlay">
      <div className="category-form-modal">
        <div className="modal-header">
          <h3>{category ? 'Edit Category' : 'Add New Category'}</h3>
          <button className="btn-icon" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="category-form">
          <div className="form-group">
            <label>Category Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter category name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Enter category description"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Parent Category</label>
              <select
                name="parentCategory"
                value={formData.parentCategory}
                onChange={handleInputChange}
                className={errors.parentCategory ? 'error' : ''}
              >
                <option value="">None (Root Category)</option>
                {availableParentCategories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.parentCategory && <span className="error-message">{errors.parentCategory}</span>}
            </div>
            
            <div className="form-group">
              <label>Sort Order</label>
              <input
                type="number"
                name="sortOrder"
                value={formData.sortOrder}
                onChange={handleInputChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Category Image</label>
            <div className="image-upload-area">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="upload-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={20} />
                Upload Image
              </button>
            </div>
            
            {(image || category?.image) && (
              <div className="image-preview">
                <img 
                  src={image?.preview || category?.image?.url} 
                  alt="Category preview" 
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={removeImage}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
              <span>Active</span>
            </label>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryForm;