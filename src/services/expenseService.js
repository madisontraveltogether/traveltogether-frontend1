import api from './api';

const expenseService = {
  getExpenses: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/expenses`);
    return response.data;
  },
  addExpense: async (tripId, expenseData) => {
    const response = await api.post(`/trips/${tripId}/expenses`, expenseData);
    return response.data;
  },
  // Add more methods as needed
};

export default expenseService;
