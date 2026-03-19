import api from './api';

export const flightService = {
  /**
   * Searches for flights based on optional criteria.
   * @param {Object} searchParams - e.g., { origin: 'KNDUS', destinationPlanet: 'Mars', page: 0 }
   */
  searchFlights: async (searchParams = {}) => {
    // Axios automatically converts the `params` object into a URL query string.
    const response = await api.get('/flights', {
      params: searchParams 
    });
    
    // Because your backend returns a Spring Data Page<FlightDTO>, 
    // the actual array of flights will be inside `response.data.content`,
    // and pagination info will be in `response.data.pageable`, `response.data.totalElements`, etc.
    return response.data; 
  },

  getFlightById: async (id) => {
    const response = await api.get(`/flights/${id}`);
    return response.data;
  },
  
  getFlightByNumber: async (flightNumber) => {
    const response = await api.get(`/flights/number/${flightNumber}`);
    return response.data;
  }
};