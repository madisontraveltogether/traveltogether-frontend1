// WebSocketContext.js
import React, { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext();

export const useWebSocket = () => useContext(WebSocketContext);

const WebSocketProvider = ({ children }) => {
  const socket = useRef();

  useEffect(() => {
    // Connect to the WebSocket server
    socket.current = io('http://your-server-url'); // Replace with your server URL

    socket.current.on('connect', () => {
      console.log('WebSocket connected:', socket.current.id);
    });

    socket.current.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    return () => {
      // Clean up the socket connection on unmount
      socket.current.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket.current}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
