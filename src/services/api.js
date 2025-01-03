import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // If cookies or tokens are required
});

// Attach token for authenticated requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken'); // Retrieve the token from local storage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Add the token to headers
  }
  return config;
});

// === Auth ===
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('api/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('api/auth/logout');
  return response.data;
};

// === Trips ===
export const createTrip = async (tripData) => {
  const response = await api.post('api/trips', tripData);
  return response.data;
};

export const getTripById = async (tripId) => {
  const response = await api.get(`api/trips/${tripId}`);
  return response.data;
};

export const updateTrip = async (tripId, updateData) => {
  const response = await api.patch(`api/trips/${tripId}`, updateData);
  return response.data;
};

export const deleteTrip = async (tripId) => {
  const response = await api.delete(`api/trips/${tripId}`);
  return response.data;
};

export const getAllUserTrips = async () => {
  const response = await api.get('api/trips/all');
  return response.data;
};

// === Guests ===
export const addGuest = async (tripId, guestData) => {
  const response = await api.post(`api/trips/${tripId}/guests`, guestData);
  return response.data;
};

export const getGuestList = async (tripId) => {
  const response = await api.get(`api/trips/${tripId}/guests`);
  return response.data;
};

export const removeGuest = async (tripId, guestId) => {
  const response = await api.delete(`api/trips/${tripId}/guests`, { data: { guestId } });
  return response.data;
};

// === Tasks ===
export const createTask = async (tripId, taskData) => {
  const response = await api.post(`api/trips/${tripId}/tasks`, taskData);
  return response.data;
};

export const getTasks = async (tripId) => {
  const response = await api.get(`api/trips/${tripId}/tasks`);
  return response.data;
};

export const updateTask = async (tripId, taskId, updateData) => {
  const response = await api.patch(`api/trips/${tripId}/tasks/${taskId}`, updateData);
  return response.data;
};

export const deleteTask = async (tripId, taskId) => {
  const response = await api.delete(`api/trips/${tripId}/tasks/${taskId}`);
  return response.data;
};

// === Expenses ===
export const createExpense = async (tripId, expenseData) => {
  const response = await api.post(`api/trips/${tripId}/expenses`, expenseData);
  return response.data;
};

export const getExpenses = async (tripId) => {
  const response = await api.get(`api/trips/${tripId}/expenses`);
  return response.data;
};

export const updateExpense = async (tripId, expenseId, updateData) => {
  const response = await api.patch(`api/trips/${tripId}/expenses/${expenseId}`, updateData);
  return response.data;
};

export const deleteExpense = async (tripId, expenseId) => {
  const response = await api.delete(`api/trips/${tripId}/expenses/${expenseId}`);
  return response.data;
};

// === Itinerary ===
export const createItineraryItem = async (tripId, itemData) => {
  const response = await api.post(`api/trips/${tripId}/itinerary`, itemData);
  return response.data;
};

export const getItinerary = async (tripId) => {
  const response = await api.get(`api/trips/${tripId}/itinerary`);
  return response.data;
};

export const updateItineraryItem = async (tripId, itemId, updateData) => {
  const response = await api.patch(`api/trips/${tripId}/itinerary/${itemId}`, updateData);
  return response.data;
};

export const deleteItineraryItem = async (tripId, itemId) => {
  const response = await api.delete(`api/trips/${tripId}/itinerary/${itemId}`);
  return response.data;
};

// === Polls ===
export const createPoll = async (tripId, pollData) => {
  const response = await api.post(`api/trips/${tripId}/polls`, pollData);
  return response.data;
};

export const getPolls = async (tripId) => {
  const response = await api.get(`api/trips/${tripId}/polls`);
  return response.data;
};

export const voteOnPoll = async (tripId, pollId, voteData) => {
  const response = await api.post(`api/trips/${tripId}/polls/${pollId}/vote`, voteData);
  return response.data;
};

export const deletePoll = async (tripId, pollId) => {
  const response = await api.delete(`api/trips/${tripId}/polls/${pollId}`);
  return response.data;
};

// === Messaging ===
export const sendMessage = async (tripId, messageData) => {
  const response = await api.post(`api/trips/${tripId}/messages`, messageData);
  return response.data;
};

export const getMessages = async (tripId) => {
  const response = await api.get(`api/trips/${tripId}/messages`);
  return response.data;
};

export const resetPassword = async (oldPassword, newPassword) => {
  const response = await api.patch('api/auth/reset-password', { oldPassword, newPassword });
  return response.data;
};

export default api;
