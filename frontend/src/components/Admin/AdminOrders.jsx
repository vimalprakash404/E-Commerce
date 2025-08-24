import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock , X} from 'lucide-react';
import apiService from '../../services/api';
import AdminTable from '../common/AdminTable';
import AdminFilters from '../common/AdminFilters';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllOrders();
      setOrders(response || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="status-icon delivered" size={16} />;
      case 'shipped':
        return <Truck className="status-icon shipped" size={16} />;
      case 'processing':
        return <Package className="status-icon processing" size={16} />;
      default:
        return <Clock className="status-icon pending" size={16} />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Order ID',
      key: 'orderId',
      render: (order) => (
        <span className="order-id">#{order._id.slice(-8)}</span>
      )
    },
    {
      header: 'Customer',
      key: 'customer',
      render: (order) => (
        <div className="customer-info">
          <span>{order.user?.firstName} {order.user?.lastName}</span>
          <small>{order.user?.email}</small>
        </div>
      )
    },
    {
      header: 'Date',
      key: 'date',
      render: (order) => new Date(order.createdAt).toLocaleDateString()
    },
    {
      header: 'Items',
      key: 'items',
      render: (order) => `${order.items.length} items`
    },
    {
      header: 'Total',
      key: 'total',
      render: (order) => `$${(order.totalPrice || 0).toFixed(2)}`
    },
    {
      header: 'Status',
      key: 'status',
      render: (order) => (
        <div className="status-cell">
          {getStatusIcon(order.status)}
          <select
            value={order.status}
            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
            className="status-select"
          >
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
      )
    }
  ];

  const filters = [
    {
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'all', label: 'All Status' },
        { value: 'pending', label: 'Pending' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipped', label: 'Shipped' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  ];

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h2>Order Management</h2>
      </div>

      <AdminFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchPlaceholder="Search orders..."
        filters={filters}
      />

      <AdminTable
        columns={columns}
        data={filteredOrders}
        onView={setSelectedOrder}
        loading={loading}
        emptyMessage="No orders found"
      />

      {selectedOrder && (
        <OrderDetailsModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)} 
        />
      )}
    </div>
  );
};

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="order-details-modal">
        <div className="modal-header">
          <h3>Order Details - #{order._id.slice(-8)}</h3>
          <button className="btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="order-details-content">
          <div className="order-info-grid">
            <div className="info-section">
              <h4>Customer Information</h4>
              <p><strong>Name:</strong> {order.user?.firstName} {order.user?.lastName}</p>
              <p><strong>Email:</strong> {order.user?.email}</p>
              <p><strong>Phone:</strong> {order.user?.phone || 'N/A'}</p>
            </div>
            
            <div className="info-section">
              <h4>Order Information</h4>
              <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ${(order.totalPrice || 0).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="info-section">
            <h4>Shipping Address</h4>
            {order.address ? (
              <div>
                <p><strong>Name:</strong> {order.address.firstName} {order.address.lastName}</p>
                <p><strong>Street:</strong> {order.address.street}</p>
                <p><strong>City:</strong> {order.address.city}, {order.address.state} {order.address.pinCode}</p>
                <p><strong>Country:</strong> {order.address.country}</p>
                <p><strong>Email:</strong> {order.address.email}</p>
                <p><strong>Phone:</strong> {order.address.phone}</p>
              </div>
            ) : (
              <p>No address provided</p>
            )}
          </div>
          
          <div className="info-section">
            <h4>Order Items</h4>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <img 
                    src={item.product?.images?.[0]?.url 
                      ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${item.product.images[0].url}`
                      : 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200'} 
                    alt={item.product?.name || 'Product'}
                  />
                  <div className="item-details">
                    <h5>{item.product?.name || 'Product Name'}</h5>
                    <p>SKU: {item.product?.sku || 'N/A'}</p>
            <p><strong>Email:</strong> {order.user?.email || 'N/A'}</p>
            <p><strong>Phone:</strong> {order.user?.phone || order.address?.phone || 'N/A'}</p>
                  </div>
                  <div className="item-total">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            <p><strong>Items Count:</strong> {order.items?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;