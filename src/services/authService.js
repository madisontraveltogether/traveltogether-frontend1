import api from './api';

const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },
  register: async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    localStorage.setItem('token', response.data.token);
    return response.data.user;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
};

export default authService;
