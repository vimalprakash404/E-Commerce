import React, { useState } from 'react';
import { Package, Truck, CheckCircle, Clock, Eye, Download } from 'lucide-react';

const Orders = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  // Mock order data
  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'delivered',
      total: 299.97,
      items: [
        { name: 'Wireless Bluetooth Headphones', quantity: 1, price: 99.99, image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=200' },
        { name: 'Smart Fitness Watch', quantity: 1, price: 249.99, image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?auto=compress&cs=tinysrgb&w=200' }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: 'TRK123456789'
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'shipped',
      total: 199.99,
      items: [
        { name: 'Designer Leather Jacket', quantity: 1, price: 199.99, image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg?auto=compress&cs=tinysrgb&w=200' }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: 'TRK987654321'
    },
    {
      id: 'ORD-003',
      date: '2024-01-25',
      status: 'processing',
      total: 89.98,
      items: [
        { name: 'Organic Cotton T-Shirt', quantity: 2, price: 29.99, image: 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=200' },
        { name: 'Yoga Mat Premium', quantity: 1, price: 39.99, image: 'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=200' }
      ],
      shippingAddress: '123 Main St, City, State 12345',
      trackingNumber: null
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="status-icon delivered" size={20} />;
      case 'shipped':
        return <Truck className="status-icon shipped" size={20} />;
      case 'processing':
        return <Clock className="status-icon processing" size={20} />;
      default:
        return <Package className="status-icon" size={20} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      default:
        return 'Unknown';
    }
  };

  const filteredOrders = orders.filter(order => {
    if (selectedTab === 'all') return true;
    return order.status === selectedTab;
  });

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
            Processing ({orders.filter(o => o.status === 'processing').length})
          </button>
          <button
            className={selectedTab === 'shipped' ? 'active' : ''}
            onClick={() => setSelectedTab('shipped')}
          >
            Shipped ({orders.filter(o => o.status === 'shipped').length})
          </button>
          <button
            className={selectedTab === 'delivered' ? 'active' : ''}
            onClick={() => setSelectedTab('delivered')}
          >
            Delivered ({orders.filter(o => o.status === 'delivered').length})
          </button>
        </div>

        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.id}</h3>
                  <p>Placed on {new Date(order.date).toLocaleDateString()}</p>
                </div>
                <div className="order-status">
                  {getStatusIcon(order.status)}
                  <span>{getStatusText(order.status)}</span>
                </div>
                <div className="order-total">
                  <strong>${order.total.toFixed(2)}</strong>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p className="item-price">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div className="shipping-info">
                  <h4>Shipping Address</h4>
                  <p>{order.shippingAddress}</p>
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
                {order.status === 'shipped' && (
                  <button className="btn btn-secondary">
                    <Truck size={16} />
                    Track Package
                  </button>
                )}
                {order.status === 'delivered' && (
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
            <button className="btn btn-primary">Start Shopping</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;