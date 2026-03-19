import axios from 'axios';

// Create a customized axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Pointing to your Spring Boot server
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach the JWT token to every request if it exists
api.interceptors.request.use(
  (config) => {
    // Check if the request URL is NOT an auth endpoint
    if (!config.url.startsWith('/auth/')) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;