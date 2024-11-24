import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import api from "../services/api";
import "../css/Messaging.css";
import TopBar from "../components/TopBar";
import BottomNav from "../components/BottomNav";

const Messaging = () => {
  const { tripId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const messageEndRef = useRef(null);

  const socket = useRef(null);

  useEffect(() => {
    socket.current = io(process.env.REACT_APP_SOCKET_URL || "https://traveltogether-server-6e176f53a84f.herokuapp.com");

    socket.current.emit("joinTrip", tripId);

    socket.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    });

    socket.current.on("userTyping", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000); // Reset typing indicator after 3 seconds
    });

    return () => {
      socket.current.disconnect();
    };
  }, [tripId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const formData = new FormData();
    formData.append("content", newMessage);
    if (attachment) formData.append("attachment", attachment);

    try {
      const response = await api.post(`/trips/${tripId}/messages`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
      setAttachment(null);
      socket.current.emit("stopTyping", tripId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleTyping = () => {
    setNewMessage(newMessage);
    socket.current.emit("typing", tripId);
  };

  const handleAttachmentChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  return (
    <div className="messaging-page">
      {/* Top Navigation */}
      <TopBar title="Messages" currentUser={{ profilePicture: "/default-avatar.jpg" }} />

      {/* Messages Section */}
      <div className="page-content messages-container">
        {messages.map((msg) => (
          <div className={`message-item ${msg.isOwn ? "own-message" : ""}`} key={msg._id}>
            <img src={msg.avatar || "/default-avatar.jpg"} alt="User Avatar" className="user-avatar" />
            <div className="message-content">
              <p className="message-username">{msg.username || "Anonymous"}</p>
              <p className="message-text">{msg.content}</p>
              {msg.attachment && <img src={msg.attachment} alt="Attachment" className="message-attachment" />}
              <p className="message-timestamp">{new Date(msg.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>
        ))}
        {isTyping && <p className="typing-indicator">Someone is typing...</p>}
        <div ref={messageEndRef}></div>
      </div>

      {/* Message Input */}
      <form className="message-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
        />
        <input type="file" onChange={handleAttachmentChange} />
        <button type="submit">Send</button>
      </form>

      {/* Bottom Navigation */}
      <BottomNav tripId={tripId} activeTab="messages" />
    </div>
  );
};

export default Messaging;
