import api from './api';

export const authService = {
  login: async (credentials) => {
    // credentials = { username: "...", password: "..." }
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  register: async (credentials) => {
    const response = await api.post('/auth/register', credentials);
    
    // Automatically log the user in if registration returns a token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};