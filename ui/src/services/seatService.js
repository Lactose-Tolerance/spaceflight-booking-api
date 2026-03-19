import api from './api';

export const seatService = {
  getSeatsForFlight: async (flightId) => {
    const response = await api.get(`/seats/flight/${flightId}`);
    return response.data;
  },
  
  getSeatById: async (seatId) => {
    const response = await api.get(`/seats/${seatId}`);
    return response.data;
  }
};