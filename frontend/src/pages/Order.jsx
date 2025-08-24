import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { orders, loading, error } = useOrders();
  const [selectedTab, setSelectedTab] = useState('all');

  if (!isAuthenticated) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="no-orders">
            <Package size={64} />
            <h3>Please login to view orders</h3>
            <p>Sign in to see your order history and track your purchases.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    const statusLower = status.toLowerCase();
    switch (status) {
      case 'delivered':
      case 'Delivered':
        return <CheckCircle className="status-icon delivered" size={20} />;
      case 'shipped':
      case 'Shipped':
        return <Truck className="status-icon shipped" size={20} />;
      case 'processing':
      case 'Processing':
      case 'Pending':
        return <Clock className="status-icon processing" size={20} />;
      default:
        return <Package className="status-icon" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
      case 'Delivered':
        return 'Delivered';
      case 'shipped':
      case 'Shipped':
        return 'Shipped';
      case 'processing':
      case 'Processing':
        return 'Processing';
      case 'Pending':
        return 'Pending';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status.toLowerCase() === selectedTab.toLowerCase();
  });

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="orders-header">
            <h1>My Orders</h1>
            <p>Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="orders-page">
        <div className="orders-container">
          <div className="no-orders">
            <Package size={64} />
            <h3>Error loading orders</h3>
            <p>{error}</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        <div className="orders-tabs">
          <button
            className={selectedTab === 'all' ? 'active' : ''}
            onClick={() => setSelectedTab('all')}
          >
            All Orders ({orders.length})
          </button>
          <button
            className={selectedTab === 'processing' ? 'active' : ''}
            onClick={() => setSelectedTab('processing')}
          >
            Processing ({orders.filter(o => ['processing', 'Processing', 'Pending'].includes(o.status)).length})
          </button>
          <button
            className={selectedTab === 'shipped' ? 'active' : ''}
            onClick={() => setSelectedTab('shipped')}
          >
            Shipped ({orders.filter(o => ['shipped', 'Shipped'].includes(o.status)).length})
          </button>
          <button
            className={selectedTab === 'delivered' ? 'active' : ''}
            onClick={() => setSelectedTab('delivered')}
          >
            Delivered ({orders.filter(o => ['delivered', 'Delivered'].includes(o.status)).length})
          </button>
        </div>

        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id?.slice(-8) || order.id}</h3>
                  <p>Placed on {new Date(order.createdAt || order.date).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span>{getStatusText(order.status)}</span>
                </div>
                <div className="order-total">
                  <strong>₹{(order.totalPrice || order.total || 0).toFixed(2)}</strong>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.product?.images?.[0]?.url || item.product?.image || item.image || 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200'} 
                      alt={item.product?.name || item.name} 
                    />
                    <div className="item-details">
                      <h4>{item.product?.name || item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">₹{(item.product?.price || item.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div className="shipping-info">
                  <h4>Shipping Address</h4>
                  <p>{order.address || order.shippingAddress || 'Address not available'}</p>
                  {order.trackingNumber && (
                    <p><strong>Tracking:</strong> {order.trackingNumber}</p>
                  )}
                </div>
              </div>

              <div className="order-actions">
                <button className="btn btn-secondary">
                  <Eye size={16} />
                  View Details
                </button>
                {['shipped', 'Shipped'].includes(order.status) && (
                  <button className="btn btn-secondary">
                    <Truck size={16} />
                    Track Package
                  </button>
                )}
                {['delivered', 'Delivered'].includes(order.status) && (
                  <button className="btn btn-secondary">
                    <Download size={16} />
                    Download Invoice
                  </button>
                )}
                <button className="btn btn-primary">
                  Reorder Items
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="no-orders">
            <Package size={64} />
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet.</p>
            <button 
              className="btn btn-primary"
              onClick={() => navigate('/products')}
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;