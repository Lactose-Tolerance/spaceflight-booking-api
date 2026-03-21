import api from './api';

export const tripService = {
  searchTrips: async (origin, destination, date) => {
    // Calls GET /api/trips/search?origin=...&destination=...&date=...
    const response = await api.get('/trips/search', {
      params: { origin, destination, date }
    });
    return response.data;
  }
};