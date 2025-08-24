import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Upload } from 'lucide-react';
import apiService from '../../services/api';
import ProductForm from './ProductForm';
import AdminTable from '../common/AdminTable';
import AdminFilters from '../common/AdminFilters';

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

  const columns = [
    {
      header: 'Image',
      key: 'image',
      render: (product) => (
        <div className="product-image-cell">
          <img 
            src={product.images?.[0]?.url || '/api/placeholder/60/60'} 
            alt={product.name}
          />
        </div>
      )
    },
    {
      header: 'Name',
      key: 'name',
      render: (product) => (
        <div className="product-name-cell">
          <h4>{product.name}</h4>
          <p>{product.sku}</p>
        </div>
      )
    },
    {
      header: 'Category',
      key: 'category',
      render: (product) => (
        <span className="category-badge">
          {product.category}
        </span>
      )
    },
    {
      header: 'Price',
      key: 'price',
      render: (product) => `$${product.price.toFixed(2)}`
    },
    {
      header: 'Stock',
      key: 'stock',
      render: (product) => (
        <span className={`stock-badge ${product.stock <= product.lowStockThreshold ? 'low' : 'normal'}`}>
          {product.stock}
        </span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (product) => (
        <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
          {product.isActive ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ];

  const filters = [
    {
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: [
        { value: 'all', label: 'All Categories' },
        ...categories.map(category => ({
          value: category,
          label: category.charAt(0).toUpperCase() + category.slice(1)
        }))
      ]
    }
  ];

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

      <AdminFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search products..."
        filters={filters}
      />

      <AdminTable
        columns={columns}
        data={filteredProducts}
        onEdit={handleEditProduct}
        onDelete={(product) => handleDeleteProduct(product._id)}
        loading={loading}
        emptyMessage="No products found"
      />

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