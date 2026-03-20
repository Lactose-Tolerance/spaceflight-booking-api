import api from './api';

export const flightService = {
  searchFlights: async (searchParams = {}) => {
    const params = { ...searchParams };
    
    if (Array.isArray(params.status) && params.status.length > 0) {
      params.status = params.status.join(',');
    } else if (params.status && params.status.length === 0) {
      delete params.status;
    }

    const response = await api.get('/flights', { params });
    return response.data; 
  },

  getFlightById: async (id) => {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },
  
  getFlightByNumber: async (flightNumber) => {
    const response = await api.get(`/flights/number/${flightNumber}`);
    return response.data;
  },

  updateFlightStatus: async (id, status) => {
    const response = await api.patch(`/flights/${id}/status`, { status });
    return response.data;
  },

  updateFlightPrices: async (id, pricesData) => {
    const response = await api.patch(`/flights/${id}/prices`, pricesData);
    return response.data;
  },

  createFlight: async (flightData) => {
    const response = await api.post('/flights', flightData);
    return response.data;
  },

  deleteFlight: async (id) => {
    const response = await api.delete(`/flights/${id}`);
    return response.data;
  },
};