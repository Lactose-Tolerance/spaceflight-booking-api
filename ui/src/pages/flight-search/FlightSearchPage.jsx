import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../../services/flightService';
import FlightCard from '../../components/molecules/flight-card/FlightCard';
import FormField from '../../components/molecules/form-field/FormField';
import Button from '../../components/atoms/button/Button';
import './FlightSearchPage.css';

// All valid backend enum statuses
const FLIGHT_STATUSES = [
  { id: 'SCHEDULED', label: 'Scheduled' },
  { id: 'DELAYED', label: 'Delayed' },
  { id: 'BOARDING', label: 'Boarding' },
  { id: 'IN_TRANSIT', label: 'In Transit' }
];

const FlightSearchPage = () => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams, setSearchParams] = useState({
    flightNumber: '',
    origin: '',
    destination: '',
    originPlanet: '',
    destinationPlanet: '',
    departure: '',
    arrival: '',
    status: [], // Array to hold checked statuses
  });

  // Dedicated sort configuration state
  const [sortConfig, setSortConfig] = useState({
    sortBy: 'departure',
    sortDir: 'ASC'
  });

  const fetchFlights = async (params = searchParams, sort = sortConfig, pageIndex = 0) => {
    setIsLoading(true);
    setError(null);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '')
      );
      
      const data = await flightService.searchFlights({ 
        ...cleanParams, 
        page: pageIndex,
        sortBy: sort.sortBy,
        sortDir: sort.sortDir
      });
      
      setFlights(data.content || []); 
      setCurrentPage(data.number || 0);       
      setTotalPages(data.totalPages || 0);    

    } catch (err) {
      setError("Failed to load flights. Please try again later.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights(searchParams, sortConfig, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount, future searches driven by submit

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [id]: value }));
  };

  // Checkbox handler
  const handleStatusChange = (statusId) => {
    setSearchParams((prev) => {
      const currentStatuses = prev.status;
      if (currentStatuses.includes(statusId)) {
        return { ...prev, status: currentStatuses.filter(s => s !== statusId) };
      } else {
        return { ...prev, status: [...currentStatuses, statusId] };
      }
    });
  };

  const handleSortChange = (e) => {
    const { id, value } = e.target;
    setSortConfig(prev => ({ ...prev, [id]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFlights(searchParams, sortConfig, 0);
  };

  const handlePageChange = (newPageIndex) => {
    fetchFlights(searchParams, sortConfig, newPageIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flight-search-page">
      <div className="page-header">
        <h1>Search Flights</h1>
        <p>Find your next journey across the solar system.</p>
      </div>

      <form className="search-bar-container" onSubmit={handleSearchSubmit}>
        
        {/* Sorting Controls */}
        <div className="sort-controls-section">
          <h3>Sort Results</h3>
          <div className="sort-grid">
            <div className="form-field-molecule">
              <label htmlFor="sortBy">Sort By</label>
              <select id="sortBy" value={sortConfig.sortBy} onChange={handleSortChange} className="form-input">
                <option value="departure">Departure Time</option>
                <option value="arrival">Arrival Time</option>
                <option value="economyPrice">Economy Price</option>
                <option value="businessPrice">Business Price</option>
                <option value="firstClassPrice">First Class Price</option>
              </select>
            </div>
            <div className="form-field-molecule">
              <label htmlFor="sortDir">Order</label>
              <select id="sortDir" value={sortConfig.sortDir} onChange={handleSortChange} className="form-input">
                <option value="ASC">Ascending (Earliest / Lowest)</option>
                <option value="DESC">Descending (Latest / Highest)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="filters-section">
          <h3>Filters</h3>
          
          <div className="status-checkboxes">
            <label className="status-group-label">Flight Status:</label>
            <div className="checkbox-row">
              {FLIGHT_STATUSES.map(status => (
                <label key={status.id} className="checkbox-label">
                  <input 
                    type="checkbox" 
                    checked={searchParams.status.includes(status.id)} 
                    onChange={() => handleStatusChange(status.id)} 
                  />
                  {status.label}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-rows mt-2">
            <div className="filter-row full-width">
              <FormField id="flightNumber" label="Flight Number" placeholder="e.g. ART-101" value={searchParams.flightNumber} onChange={handleInputChange} />
            </div>

            <div className="filter-row halves">
              <FormField id="origin" label="Origin Code/Name" placeholder="e.g. KNDUS" value={searchParams.origin} onChange={handleInputChange} />
              <FormField id="originPlanet" label="Origin Planet" placeholder="e.g. Earth" value={searchParams.originPlanet} onChange={handleInputChange} />
            </div>

            <div className="filter-row halves">
              <FormField id="destination" label="Destination Code/Name" placeholder="e.g. LGTWY" value={searchParams.destination} onChange={handleInputChange} />
              <FormField id="destinationPlanet" label="Dest. Planet" placeholder="e.g. Moon" value={searchParams.destinationPlanet} onChange={handleInputChange} />
            </div>

            <div className="filter-row halves">
              <FormField id="departure" label="Departure After" type="datetime-local" value={searchParams.departure} onChange={handleInputChange} />
              <FormField id="arrival" label="Arrival Before" type="datetime-local" value={searchParams.arrival} onChange={handleInputChange} />
            </div>
          </div>
        </div>

        <div className="search-actions">
          <Button type="button" variant="ghost" onClick={() => {
            const cleared = { flightNumber: '', origin: '', destination: '', originPlanet: '', destinationPlanet: '', departure: '', arrival: '', status: [] };
            setSearchParams(cleared);
            setSortConfig({ sortBy: 'departure', sortDir: 'ASC' });
            fetchFlights(cleared, { sortBy: 'departure', sortDir: 'ASC' }, 0);
          }}>
            Clear Filters
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search Flights'}
          </Button>
        </div>
      </form>

      <div className="results-container">
        {/* Pagination Controls Top */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="pagination-controls compact-pagination">
             {/* Same as bottom, omitted duplicated code for length, see bottom */}
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
              <FlightCard key={flight.id} flight={flight} onSelect={() => navigate(`/flights/${flight.id}/seats`)} />
            ))}
          </div>
        )}

        {/* Pagination Controls Bottom */}
        {!isLoading && !error && totalPages > 1 && (
          <div className="pagination-controls">
            <Button variant="secondary" disabled={currentPage === 0} onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </Button>
            <span className="pagination-info">Page {currentPage + 1} of {totalPages}</span>
            <Button variant="secondary" disabled={currentPage === totalPages - 1} onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearchPage;