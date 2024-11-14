import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Set up this environment variable
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default api;
export const login = (credentials) => api.post('/auth/login', credentials);
export const fetchTrips = () => api.get('/trips');
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (credentials) => api.post('/auth/login', credentials);
export const fetchUserProfile = () => api.get('/auth/me');
