import api from './api';

export const portService = {
  getAllPorts: async () => {
    const response = await api.get('/ports');
    return response.data.content || response.data; 
  },
  
  createPort: async (portData) => {
    const response = await api.post('/ports', portData);
    return response.data;
  },

  deletePort: async (code) => {
    const response = await api.delete(`/ports/${code}`);
    return response.data;
  }
};

// Add a quick planet service here too!
export const planetService = {
  getAllPlanets: async () => {
    const response = await api.get('/planets');
    return response.data.content || response.data;
  }
};