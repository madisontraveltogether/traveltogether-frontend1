// src/pages/Notifications.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null); // State to manage WebSocket connection

  useEffect(() => {
    // Fetch initial notifications from the server
    const fetchNotifications = async () => {
      try {
        const response = await api.get('/api/notifications');
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to load notifications.');
      }
    };

    fetchNotifications();

    // Set up WebSocket connection
    const socketInstance = io('https://traveltogether-server-6e176f53a84f.herokuapp.com/'); // Replace with your server URL
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      console.log('WebSocket connected:', socketInstance.id);
    });

    // Listen for real-time notifications
    socketInstance.on('newNotification', (notification) => {
      console.log('Received new notification:', notification);
      setNotifications((prev) => [notification, ...prev]); // Add the new notification to the list
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    // Clean up WebSocket on unmount
    return () => {
      socketInstance.disconnect();
    };
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
