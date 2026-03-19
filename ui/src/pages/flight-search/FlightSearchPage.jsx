import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../../services/flightService';
import FlightCard from '../../components/molecules/flight-card/FlightCard';
import FormField from '../../components/molecules/form-field/FormField';
import Button from '../../components/atoms/button/Button';
import './FlightSearchPage.css';

const FlightSearchPage = () => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0); // Spring Boot pages are 0-indexed
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    originPlanet: '',
    destinationPlanet: '',
    departure: '',
    arrival: '',
  });

  // Added pageIndex parameter, defaulting to 0
  const fetchFlights = async (params = {}, pageIndex = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '')
      );
      
      // Pass the page index to the API
      const data = await flightService.searchFlights({ ...cleanParams, page: pageIndex });
      
      setFlights(data.content || []); 
      setCurrentPage(data.number || 0);       // Update current page from backend
      setTotalPages(data.totalPages || 0);    // Update total pages from backend

    } catch (err) {
      setError("Failed to load flights. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights({}, 0);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [id]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Always reset to page 0 when initiating a brand new search
    fetchFlights(searchParams, 0);
  };

  const handlePageChange = (newPageIndex) => {
    // Fetch the new page using the existing search parameters
    fetchFlights(searchParams, newPageIndex);
    // Optional: Scroll back to the top of the results
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectFlight = (flight) => {
    navigate(`/flights/${flight.id}/seats`);
  };

  return (
    <div className="flight-search-page">
      <div className="page-header">
        <h1>Search Flights</h1>
        <p>Find your next journey across the solar system.</p>
      </div>

      <form className="search-bar-container" onSubmit={handleSearchSubmit}>
        <div className="search-grid">
          <FormField id="origin" label="Origin Port Code/Name" placeholder="e.g. KNDUS" value={searchParams.origin} onChange={handleInputChange} />
          <FormField id="destination" label="Destination Port Code/Name" placeholder="e.g. LGTWY" value={searchParams.destination} onChange={handleInputChange} />
          <FormField id="originPlanet" label="Origin Planet" placeholder="e.g. Earth" value={searchParams.originPlanet} onChange={handleInputChange} />
          <FormField id="destinationPlanet" label="Destination Planet" placeholder="e.g. Moon" value={searchParams.destinationPlanet} onChange={handleInputChange} />
          <FormField id="departure" label="Departure After" type="datetime-local" value={searchParams.departure} onChange={handleInputChange} />
          <FormField id="arrival" label="Arrival Before" type="datetime-local" value={searchParams.arrival} onChange={handleInputChange} />
        </div>
        <div className="search-actions">
          <Button type="button" variant="ghost" onClick={() => {
            const cleared = { origin: '', destination: '', originPlanet: '', destinationPlanet: '', departure: '', arrival: '' };
            setSearchParams(cleared);
            fetchFlights({}, 0);
          }}>
            Clear Filters
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search Flights'}
          </Button>
        </div>
      </form>

      <div className="results-container">
        {/* Pagination Controls */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="pagination-controls">
            <Button 
              variant="secondary" 
              disabled={currentPage === 0} 
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            
            <span className="pagination-info">
              Page {currentPage + 1} of {totalPages}
            </span>
            
            <Button 
              variant="secondary" 
              disabled={currentPage === totalPages - 1} 
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
        
        {isLoading && <div className="loading-state">Scanning orbital trajectories...</div>}
        {error && <div className="error-state">{error}</div>}
        {!isLoading && !error && flights.length === 0 && (
          <div className="empty-state">No flights found matching your criteria.</div>
        )}

        {!isLoading && !error && flights.length > 0 && (
          <div className="flights-list">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchPage;