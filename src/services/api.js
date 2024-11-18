import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'https://traveltogether-server-6e176f53a84f.herokuapp.com/api', // Update with your server's base URL
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
  const response = await api.get('/auth/me');
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/auth/logout');
  return response.data;
};

// === Trips ===
export const createTrip = async (tripData) => {
  const response = await api.post('/trips', tripData, {
    headers: { 'Content-Type': 'multipart/form-data' }, // For file uploads
  });
  return response.data;
};

export const getTripById = async (tripId) => {
  const response = await api.get(`/trips/${tripId}`);
  return response.data;
};

export const updateTrip = async (tripId, updateData) => {
  const response = await api.patch(`/trips/${tripId}`, updateData);
  return response.data;
};

export const deleteTrip = async (tripId) => {
  const response = await api.delete(`/trips/${tripId}`);
  return response.data;
};

export const getAllUserTrips = async () => {
  const response = await api.get('/trips/all');
  return response.data;
};

// === Guests ===
export const addGuest = async (tripId, guestData) => {
  const response = await api.post(`/trips/${tripId}/guests`, guestData);
  return response.data;
};

export const getGuestList = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/guests`);
  return response.data;
};

export const removeGuest = async (tripId, guestId) => {
  const response = await api.delete(`/trips/${tripId}/guests`, { data: { guestId } });
  return response.data;
};

// === Tasks ===
export const createTask = async (tripId, taskData) => {
  const response = await api.post(`/trips/${tripId}/tasks`, taskData);
  return response.data;
};

export const getTasks = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/tasks`);
  return response.data;
};

export const updateTask = async (tripId, taskId, updateData) => {
  const response = await api.patch(`/trips/${tripId}/tasks/${taskId}`, updateData);
  return response.data;
};

export const deleteTask = async (tripId, taskId) => {
  const response = await api.delete(`/trips/${tripId}/tasks/${taskId}`);
  return response.data;
};

// === Expenses ===
export const createExpense = async (tripId, expenseData) => {
  const response = await api.post(`/trips/${tripId}/expenses`, expenseData);
  return response.data;
};

export const getExpenses = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/expenses`);
  return response.data;
};

export const updateExpense = async (tripId, expenseId, updateData) => {
  const response = await api.patch(`/trips/${tripId}/expenses/${expenseId}`, updateData);
  return response.data;
};

export const deleteExpense = async (tripId, expenseId) => {
  const response = await api.delete(`/trips/${tripId}/expenses/${expenseId}`);
  return response.data;
};

// === Itinerary ===
export const createItineraryItem = async (tripId, itemData) => {
  const response = await api.post(`/trips/${tripId}/itinerary`, itemData);
  return response.data;
};

export const getItinerary = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/itinerary`);
  return response.data;
};

export const updateItineraryItem = async (tripId, itemId, updateData) => {
  const response = await api.patch(`/trips/${tripId}/itinerary/${itemId}`, updateData);
  return response.data;
};

export const deleteItineraryItem = async (tripId, itemId) => {
  const response = await api.delete(`/trips/${tripId}/itinerary/${itemId}`);
  return response.data;
};

// === Polls ===
export const createPoll = async (tripId, pollData) => {
  const response = await api.post(`/trips/${tripId}/polls`, pollData);
  return response.data;
};

export const getPolls = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/polls`);
  return response.data;
};

export const voteOnPoll = async (tripId, pollId, voteData) => {
  const response = await api.post(`/trips/${tripId}/polls/${pollId}/vote`, voteData);
  return response.data;
};

export const deletePoll = async (tripId, pollId) => {
  const response = await api.delete(`/trips/${tripId}/polls/${pollId}`);
  return response.data;
};

// === Messaging ===
export const sendMessage = async (tripId, messageData) => {
  const response = await api.post(`/trips/${tripId}/messages`, messageData);
  return response.data;
};

export const getMessages = async (tripId) => {
  const response = await api.get(`/trips/${tripId}/messages`);
  return response.data;
};

export default api;
