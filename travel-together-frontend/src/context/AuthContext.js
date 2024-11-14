// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    // Save token to both localStorage and context
    const saveToken = (newToken) => {
        localStorage.setItem('token', newToken);
        setToken(newToken);
    };

    // Clear token from both localStorage and context
    const clearToken = () => {
        localStorage.removeItem('token');
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, saveToken, clearToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
