import api from './api';

export const bookingService = {
  bookSeat: async (seatId) => {
    const response = await api.post(`/bookings/seat/${seatId}`);
    return response.data;
  },
  
  getMyBookings: async () => {
    const response = await api.get('/bookings/me');
    return response.data;
  },

  cancelBooking: async (reference) => {
    const response = await api.delete(`/bookings/${reference}`);
    return response.data;
  },

  getBoardingPass: async (reference) => {
    const response = await api.get(`/bookings/${reference}/boarding-pass`);
    return response.data;
  },

  getFlightManifest: async (flightId) => {
    const response = await api.get(`/bookings/flight/${flightId}`);
    return response.data;
  },
};