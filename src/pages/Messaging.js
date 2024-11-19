import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';
import '../css/Messaging.css'; 
import TopBar from '../components/TopBar';
import BottomNav from '../components/BottomNav';

const Messaging = () => {
  const { tripId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [user, setUser] = useState(null);
  const messageEndRef = useRef(null);
  const socket = useRef(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL || 'https://traveltogether-server-6e176f53a84f.herokuapp.com');
    socket.current.emit('joinTrip', tripId);

    socket.current.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    });

    return () => {
      socket.current.disconnect();
    };
  }, [tripId]);

  useEffect(() => {
    const fetchUserAndMessages = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const userResponse = await api.get('/auth/me');
        setUser(userResponse.data);
      }

      const messagesResponse = await api.get(`/trips/${tripId}/messages`);
      setMessages(messagesResponse.data);
      scrollToBottom();
    };

    fetchUserAndMessages();
  }, [tripId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = { content: newMessage };

    try {
      const response = await api.post(`/trips/${tripId}/messages`, messageData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      socket.current.emit('sendMessage', response.data);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messaging-page">
            <TopBar title="Messages" />

      <header className="messaging-header">
        <h1 className="chat-title">All Group Members</h1>
        <button className="notification-button">🔔</button>
      </header>

      <div className="messages-container">
        {messages.map((msg) => (
          <div className={`message-item ${msg.userId?._id === user?._id ? 'own-message' : ''}`} key={msg._id}>
            <img src={msg.userId?.avatar || '/default-avatar.jpg'} alt="User Avatar" className="user-avatar" />
            <div className="message-content">
              <p className="message-username">{msg.userId?.name || 'Anonymous'}</p>
              <p className="message-text">{msg.content}</p>
              <p className="message-time">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type something..."
          className="message-input"
        />
        <button type="submit" className="send-button">
          ➤
        </button>
      </form>
      <BottomNav />

    </div>
  );
};

export default Messaging;
