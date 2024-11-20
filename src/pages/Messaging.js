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
  const messageEndRef = useRef(null);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKET_URL || 'https://example.com');
    socket.emit('joinTrip', tripId);

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });

    return () => {
      socket.disconnect();
    };
  }, [tripId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await api.post(`/trips/${tripId}/messages`, { content: newMessage });
      setMessages((prev) => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="messaging-page">
      {/* Top Navigation */}
      <TopBar title="Messages" currentUser={{ profilePicture: '/default-avatar.jpg' }} />

      {/* Messages Section */}
      <div className="page-content messages-container">
        {messages.map((msg) => (
          <div className={`message-item ${msg.isOwn ? 'own-message' : ''}`} key={msg._id}>
            <img src={msg.avatar || '/default-avatar.jpg'} alt="User Avatar" className="user-avatar" />
            <div className="message-content">
              <p className="message-username">{msg.username || 'Anonymous'}</p>
              <p className="message-text">{msg.content}</p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      {/* Message Input */}
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>

      {/* Bottom Navigation */}
      <BottomNav active="messages" />
    </div>
  );
};

export default Messaging;
