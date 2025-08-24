import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import apiService from '../../services/api';

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

  if (loading) {
    return <div className="admin-loading">Loading orders...</div>;
  }

  return (
    <div className="admin-orders">
      <div className="admin-orders-header">
        <h2>Order Management</h2>
      </div>

      <div className="admin-orders-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="admin-orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order._id}>
                <td>
                  <span className="order-id">#{order._id.slice(-8)}</span>
                </td>
                <td>
                  <div className="customer-info">
                    <span>{order.user?.firstName} {order.user?.lastName}</span>
                    <small>{order.user?.email}</small>
                  </div>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.items.length} items</td>
                <td>${(order.totalPrice || 0).toFixed(2)}</td>
                <td>
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
                </td>
                <td>
                  <button 
                    className="btn-icon"
                    onClick={() => setSelectedOrder(order)}
                    title="View Details"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
            <p>{order.address || 'No address provided'}</p>
          </div>
          
          <div className="info-section">
            <h4>Order Items</h4>
            <div className="order-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <img 
                    src={item.product?.images?.[0]?.url || '/api/placeholder/60/60'} 
                    alt={item.product?.name}
                  />
                  <div className="item-details">
                    <h5>{item.product?.name}</h5>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${(item.product?.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="item-total">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;