import api from './api';

const taskService = {
  getTasks: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/tasks`);
    return response.data;
  },
  addTask: async (tripId, taskData) => {
    const response = await api.post(`/trips/${tripId}/tasks`, taskData);
    return response.data;
  },
  // Additional task-related methods can go here
};

export default taskService;
