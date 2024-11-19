// src/pages/Notifications.js
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to load notifications.');
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(
        notifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      setError('Failed to mark notification as read.');
    }
  };

  return (
    <div className="notifications">
      <TopBar title="Notifications" />
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {notifications.map((notification) => (
          <li key={notification._id} className={notification.read ? 'read' : 'unread'}>
            <p>{notification.message}</p>
            <span>{new Date(notification.timestamp).toLocaleString()}</span>
            {!notification.read && (
              <button onClick={() => markAsRead(notification._id)}>Mark as Read</button>
            )}
          </li>
        ))}
      </ul>
      <BottomNav />

    </div>
  );
};

export default Notifications;
