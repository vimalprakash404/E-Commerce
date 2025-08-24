import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Upload } from 'lucide-react';
import apiService from '../../services/api';
import ProductForm from './ProductForm';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getProducts({ limit: 1000 });
      setProducts(response.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await apiService.deleteProduct(productId);
        setProducts(products.filter(p => p._id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product');
      }
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleProductSaved = (savedProduct) => {
    if (editingProduct) {
      setProducts(products.map(p => p._id === savedProduct._id ? savedProduct : p));
    } else {
      setProducts([savedProduct, ...products]);
    }
    setShowProductForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) {
    return <div className="admin-loading">Loading products...</div>;
  }

  return (
    <div className="admin-products">
      <div className="admin-products-header">
        <h2>Product Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowProductForm(true)}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="admin-products-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="admin-products-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="product-image-cell">
                    <img 
                      src={product.images?.[0]?.url || '/api/placeholder/60/60'} 
                      alt={product.name}
                    />
                  </div>
                </td>
                <td>
                  <div className="product-name-cell">
                    <h4>{product.name}</h4>
                    <p>{product.sku}</p>
                  </div>
                </td>
                <td>
                  <span className="category-badge">
                    {product.category}
                  </span>
                </td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`stock-badge ${product.stock <= product.lowStockThreshold ? 'low' : 'normal'}`}>
                    {product.stock}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="btn-icon"
                      onClick={() => handleEditProduct(product)}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      className="btn-icon delete"
                      onClick={() => handleDeleteProduct(product._id)}
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

      {showProductForm && (
        <ProductForm
          product={editingProduct}
          onSave={handleProductSaved}
          onCancel={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProducts;