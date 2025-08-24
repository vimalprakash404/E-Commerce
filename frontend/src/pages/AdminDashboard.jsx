import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Plus,
  Bell,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import AdminProducts from '../components/Admin/AdminProducts';
import AdminOrders from '../components/Admin/AdminOrders';
import AdminInventory from '../components/Admin/AdminInventory';
import AdminCategories from '../components/Admin/AdminCategories';
import AdminNotifications from '../components/Admin/AdminNotifications';
import { useSocket } from '../hooks/useSocket';
import apiService from '../services/api';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    lowStockItems: 0,
    totalRevenue: 0
  });
  const [notifications, setNotifications] = useState([]);
  const socket = useSocket();

  useEffect(() => {
    if (!isAuthenticated || !user?.roles?.includes('admin')) {
      navigate('/login');
      return;
    }
    
    fetchDashboardStats();
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (socket) {
      // Listen for real-time notifications
      socket.on('new_order', (data) => {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'order',
          title: 'New Order Received',
          message: `Order from ${data.customerName} - $${data.total}`,
          timestamp: new Date(),
          unread: true
        }, ...prev]);
        
        // Update stats
        setStats(prev => ({
          ...prev,
          totalOrders: prev.totalOrders + 1,
          totalRevenue: prev.totalRevenue + data.total
        }));
      });

      socket.on('low_stock_alert', (data) => {
        setNotifications(prev => [{
          id: Date.now(),
          type: 'warning',
          title: 'Low Stock Alert',
          message: `${data.name} is running low (${data.currentStock} left)`,
          timestamp: new Date(),
          unread: true
        }, ...prev]);
      });

      socket.on('product_created', (data) => {
        setStats(prev => ({
          ...prev,
          totalProducts: prev.totalProducts + 1
        }));
      });

      return () => {
        socket.off('new_order');
        socket.off('low_stock_alert');
        socket.off('product_created');
      };
    }
  }, [socket]);

  const fetchDashboardStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        apiService.getProducts({ limit: 1000 }),
        apiService.getAllOrders()
      ]);

      const products = productsRes.products || [];
      const orders = ordersRes || [];
      
      const lowStockItems = products.filter(p => p.stock <= p.lowStockThreshold).length;
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        lowStockItems,
        totalRevenue
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-content">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'inventory':
        return <AdminInventory />;
      case 'categories':
        return <AdminCategories />;
      case 'notifications':
        return <AdminNotifications notifications={notifications} setNotifications={setNotifications} />;
      default:
        return (
          <div className="overview-content">
            <div className="stats-grid">
              <StatCard
                icon={Package}
                title="Total Products"
                value={stats.totalProducts}
                color="blue"
              />
              <StatCard
                icon={ShoppingCart}
                title="Total Orders"
                value={stats.totalOrders}
                color="green"
              />
              <StatCard
                icon={AlertTriangle}
                title="Low Stock Items"
                value={stats.lowStockItems}
                color="orange"
              />
              <StatCard
                icon={TrendingUp}
                title="Total Revenue"
                value={`$${stats.totalRevenue.toFixed(2)}`}
                color="purple"
              />
            </div>
            
            <div className="recent-activity">
              <h3>Recent Activity</h3>
              <div className="activity-list">
                {notifications.slice(0, 5).map(notification => (
                  <div key={notification.id} className="activity-item">
                    <div className={`activity-icon ${notification.type}`}>
                      {notification.type === 'order' ? <ShoppingCart size={16} /> : <AlertTriangle size={16} />}
                    </div>
                    <div className="activity-content">
                      <p>{notification.message}</p>
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.firstName}</p>
        </div>
        <div className="admin-header-right">
          <button 
            className="notification-btn"
            onClick={() => setActiveTab('notifications')}
          >
            <Bell size={20} />
            {notifications.filter(n => n.unread).length > 0 && (
              <span className="notification-badge">
                {notifications.filter(n => n.unread).length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="admin-nav">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          <TrendingUp size={20} />
          Overview
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          <Package size={20} />
          Products
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          <Package size={20} />
          Categories
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingCart size={20} />
          Orders
        </button>
        <button
          className={activeTab === 'inventory' ? 'active' : ''}
          onClick={() => setActiveTab('inventory')}
        >
          <Package size={20} />
          Inventory
        </button>
      </div>

      <div className="admin-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;