// src/index.js or src/App.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import WebSocketProvider from './WebSocketContext';
ReactDOM.render(
    <WebSocketProvider>
    <AuthProvider>
        <App />
    </AuthProvider>
    </WebSocketProvider>,
    document.getElementById('root')
);
