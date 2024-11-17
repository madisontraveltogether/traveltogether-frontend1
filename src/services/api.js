// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://traveltogether-server-6e176f53a84f.herokuapp.com/',
});

// Attach token for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export const createTrip = async (tripData) => {
    const response = await api.post('/trips', tripData);
    return response.data;
  };

export default api;
