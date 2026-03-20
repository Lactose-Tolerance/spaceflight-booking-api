import api from './api';

export const portService = {
  getAllPorts: async () => {
    const response = await api.get('/ports');
    return response.data.content || response.data; 
  }
};