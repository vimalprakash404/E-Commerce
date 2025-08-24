import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, Search } from 'lucide-react';
import apiService from '../../services/api';

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

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

  const updateStock = async (productId, newStock) => {
    try {
      const updatedProduct = await apiService.updateProduct(productId, { stock: newStock });
      setProducts(products.map(p => p._id === productId ? updatedProduct : p));
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock');
    }
  };

  const getStockStatus = (product) => {
    if (product.stock === 0) return 'out-of-stock';
    if (product.stock <= product.lowStockThreshold) return 'low-stock';
    return 'in-stock';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesFilter = true;
    if (filterType === 'low-stock') {
      matchesFilter = product.stock <= product.lowStockThreshold && product.stock > 0;
    } else if (filterType === 'out-of-stock') {
      matchesFilter = product.stock === 0;
    }
    
    return matchesSearch && matchesFilter;
  });

  const stockStats = {
    total: products.length,
    lowStock: products.filter(p => p.stock <= p.lowStockThreshold && p.stock > 0).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0)
  };

  if (loading) {
    return <div className="admin-loading">Loading inventory...</div>;
  }

  return (
    <div className="admin-inventory">
      <div className="admin-inventory-header">
        <h2>Inventory Management</h2>
      </div>

      <div className="inventory-stats">
        <div className="stat-card">
          <div className="stat-icon blue">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>{stockStats.total}</h3>
            <p>Total Products</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon orange">
            <TrendingDown size={24} />
          </div>
          <div className="stat-content">
            <h3>{stockStats.lowStock}</h3>
            <p>Low Stock</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon red">
            <AlertTriangle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stockStats.outOfStock}</h3>
            <p>Out of Stock</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">
            <Package size={24} />
          </div>
          <div className="stat-content">
            <h3>${stockStats.totalValue.toFixed(2)}</h3>
            <p>Total Value</p>
          </div>
        </div>
      </div>

      <div className="admin-inventory-filters">
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
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Products</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      <div className="admin-inventory-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>SKU</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Low Stock Threshold</th>
              <th>Status</th>
              <th>Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product._id}>
                <td>
                  <div className="product-cell">
                    <img 
                      src={product.images?.[0]?.url || '/api/placeholder/40/40'} 
                      alt={product.name}
                    />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{product.sku}</td>
                <td>
                  <span className="category-badge">
                    {product.category}
                  </span>
                </td>
                <td>
                  <input
                    type="number"
                    value={product.stock}
                    onChange={(e) => updateStock(product._id, parseInt(e.target.value) || 0)}
                    className="stock-input"
                    min="0"
                  />
                </td>
                <td>{product.lowStockThreshold}</td>
                <td>
                  <span className={`stock-status ${getStockStatus(product)}`}>
                    {getStockStatus(product) === 'out-of-stock' ? 'Out of Stock' :
                     getStockStatus(product) === 'low-stock' ? 'Low Stock' : 'In Stock'}
                  </span>
                </td>
                <td>${(product.price * product.stock).toFixed(2)}</td>
                <td>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      const newStock = prompt('Enter new stock quantity:', product.stock);
                      if (newStock !== null) {
                        updateStock(product._id, parseInt(newStock) || 0);
                      }
                    }}
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInventory;