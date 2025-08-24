import React, { useState, useEffect } from 'react';
import { AlertTriangle, Package, TrendingDown, Search } from 'lucide-react';
import apiService from '../../services/api';
import AdminTable from '../common/AdminTable';
import AdminFilters from '../common/AdminFilters';

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

  const columns = [
    {
      header: 'Product',
      key: 'product',
      render: (product) => (
        <div className="product-cell">
          <img 
            src={product.images?.[0]?.url || '/api/placeholder/40/40'} 
            alt={product.name}
          />
          <span>{product.name}</span>
        </div>
      )
    },
    {
      header: 'SKU',
      key: 'sku',
      render: (product) => product.sku
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
      header: 'Current Stock',
      key: 'stock',
      render: (product) => (
        <input
          type="number"
          value={product.stock}
          onChange={(e) => updateStock(product._id, parseInt(e.target.value) || 0)}
          className="stock-input"
          min="0"
        />
      )
    },
    {
      header: 'Low Stock Threshold',
      key: 'lowStockThreshold',
      render: (product) => product.lowStockThreshold
    },
    {
      header: 'Status',
      key: 'status',
      render: (product) => (
        <span className={`stock-status ${getStockStatus(product)}`}>
          {getStockStatus(product) === 'out-of-stock' ? 'Out of Stock' :
           getStockStatus(product) === 'low-stock' ? 'Low Stock' : 'In Stock'}
        </span>
      )
    },
    {
      header: 'Value',
      key: 'value',
      render: (product) => `$${(product.price * product.stock).toFixed(2)}`
    }
  ];

  const filters = [
    {
      value: filterType,
      onChange: setFilterType,
      options: [
        { value: 'all', label: 'All Products' },
        { value: 'low-stock', label: 'Low Stock' },
        { value: 'out-of-stock', label: 'Out of Stock' }
      ]
    }
  ];

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

      <AdminFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search products..."
        filters={filters}
      />

      <AdminTable
        columns={columns}
        data={filteredProducts}
        loading={loading}
        emptyMessage="No products found"
        onEdit={(product) => {
          const newStock = prompt('Enter new stock quantity:', product.stock);
          if (newStock !== null) {
            updateStock(product._id, parseInt(newStock) || 0);
          }
        }}
      />
    </div>
  );
};

export default AdminInventory;