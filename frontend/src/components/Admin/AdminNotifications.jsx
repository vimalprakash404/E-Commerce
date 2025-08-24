import React from 'react';
import { Bell, ShoppingCart, AlertTriangle, Package, Check, Trash2 } from 'lucide-react';

const AdminNotifications = ({ notifications, setNotifications }) => {
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, unread: false }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order':
        return <ShoppingCart size={20} className="notification-icon order" />;
      case 'warning':
        return <AlertTriangle size={20} className="notification-icon warning" />;
      case 'product':
        return <Package size={20} className="notification-icon product" />;
      default:
        return <Bell size={20} className="notification-icon default" />;
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="admin-notifications">
      <div className="notifications-header">
        <h2>Notifications</h2>
        <div className="notifications-actions">
          {unreadCount > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={markAllAsRead}
            >
              <Check size={16} />
              Mark All Read ({unreadCount})
            </button>
          )}
        </div>
      </div>

      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up!</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.unread ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <div className="notification-header">
                  {getNotificationIcon(notification.type)}
                  <div className="notification-text">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                  </div>
                  {notification.unread && <div className="unread-indicator" />}
                </div>
                <div className="notification-meta">
                  <span className="notification-time">
                    {new Date(notification.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="notification-actions">
                {notification.unread && (
                  <button 
                    className="btn-icon"
                    onClick={() => markAsRead(notification.id)}
                    title="Mark as read"
                  >
                    <Check size={16} />
                  </button>
                )}
                <button 
                  className="btn-icon delete"
                  onClick={() => deleteNotification(notification.id)}
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;