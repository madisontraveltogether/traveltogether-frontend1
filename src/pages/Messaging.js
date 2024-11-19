import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import api from '../services/api';

const Messaging = () => {
  const { tripId } = useParams(); // Get tripId from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typingUsers, setTypingUsers] = useState([]);
  const [user, setUser] = useState(null); // Store user info
  const [onlineUsers, setOnlineUsers] = useState({});
  const socket = io(process.env.REACT_APP_SOCKET_URL || 'https://www.gettraveltogether.com/');
  const messageEndRef = useRef(null);

  // Scroll to the bottom of the chat
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Initialize WebSocket connection and listeners
  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000');
    socket.current.emit('joinTrip', tripId);

    // Listeners for real-time events
    socket.current.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      scrollToBottom();
    });

    socket.current.on('userTyping', (typingData) => {
      if (typingData.tripId === tripId && typingData.userId !== user?._id) {
        setTypingUsers((prev) => [...prev, typingData.userName]);
        setTimeout(() => {
          setTypingUsers((prev) => prev.filter((name) => name !== typingData.userName));
        }, 3000); // Remove typing indicator after 3 seconds
      }
    });

    socket.current.on('updateOnlineUsers', (users) => {
      setOnlineUsers(users);
    });

    socket.current.on('reactionUpdate', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === data.messageId ? { ...msg, reactions: data.reactions } : msg
        )
      );
    });

    return () => {
      socket.current.disconnect();
    };
  }, [tripId, user]);

  // Fetch user and messages on component load
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
      console.error('Error sending message:', error.response?.data || error.message);
    }
  };
  

  const handleTyping = () => {
    socket.current.emit('typing', { tripId, userId: user._id, userName: user.name });
  };

  const handleReaction = (messageId, emoji) => {
    api.post(`/messages/${messageId}/react`, { emoji }).catch((err) =>
      console.error('Error adding reaction:', err)
    );
  };

  return (
    <div>
      <h2>Group Chat</h2>

      {/* Group Members and Online Status */}
      <div>
        <h4>Group Members</h4>
        <ul>
          {Object.entries(onlineUsers).map(([userId, socketId]) => (
            <li key={userId}>{userId} (Online)</li>
          ))}
        </ul>
      </div>

      {/* Messages Display */}
      <div style={{ height: '70vh', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        {messages.map((msg) => (
          <div key={msg._id} style={{ marginBottom: '1rem' }}>
            <strong>{msg.userId?.name || 'Anonymous'}:</strong> {msg.content}
            <div>
              {msg.reactions?.map((reaction, index) => (
                <span key={index}>{reaction.emoji}</span>
              ))}
            </div>
            <button onClick={() => handleReaction(msg._id, '👍')}>👍</button>
            <button onClick={() => handleReaction(msg._id, '❤️')}>❤️</button>
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div style={{ fontStyle: 'italic', color: 'gray' }}>
          {typingUsers.join(', ')} {typingUsers.length > 1 ? 'are' : 'is'} typing...
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSendMessage} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type your message..."
          style={{ width: '80%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem' }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Messaging;
