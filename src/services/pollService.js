import api from './api';

const pollService = {
  getPolls: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/polls`);
    return response.data;
  },
  createPoll: async (tripId, pollData) => {
    const response = await api.post(`/trips/${tripId}/polls`, pollData);
    return response.data;
  },
  // Additional poll-related methods can go here
};

export default pollService;
