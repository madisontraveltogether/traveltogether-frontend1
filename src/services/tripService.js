import api from './api';

const tripService = {
  getTrips: async () => {
    const response = await api.get('/trips');
    return response.data;
  },
  getTripDetails: async (tripId) => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },
  // Add more methods as needed
};

export default tripService;
