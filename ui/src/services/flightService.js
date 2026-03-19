import api from './api';

export const flightService = {
  searchFlights: async (searchParams = {}) => {
    // Clone params so we don't mutate the react state directly
    const params = { ...searchParams };
    
    // Convert status array to comma-separated string for Spring Boot
    if (Array.isArray(params.status) && params.status.length > 0) {
      params.status = params.status.join(',');
    } else if (params.status && params.status.length === 0) {
      delete params.status; // Don't send empty status arrays
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
    // Note: Spring Boot expects a JSON object like { "status": "DELAYED" }
    const response = await api.patch(`/flights/${id}/status`, { status });
    return response.data;
  },

  updateFlightPrices: async (id, pricesData) => {
    // pricesData should be { firstClassPrice: 0, businessPrice: 0, economyPrice: 0 }
    const response = await api.patch(`/flights/${id}/prices`, pricesData);
    return response.data;
  }
};