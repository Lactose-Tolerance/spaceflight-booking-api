import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/atoms/button/Button';
import TripCard from '../../components/molecules/trip-card/TripCard';
import { tripService } from '../../services/tripService';
import { portService } from '../../services/portService';
import '../trip-planning/TripPlanningPage.css';

const TripPlanningPage = () => {
  const navigate = useNavigate();
  const [ports, setPorts] = useState([]);
  const [origin, setOrigin] = useState('KNDUS');
  const [destination, setDestination] = useState('MGTWY');
  const [date, setDate] = useState('2026-03-23');
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available ports for the dropdowns
  useEffect(() => {
    const fetchPorts = async () => {
      try {
        const data = await portService.getAllPorts();
        setPorts(data);
      } catch (err) {
        console.error("Failed to load ports", err);
      }
    };
    fetchPorts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const results = await tripService.searchTrips(origin, destination, date);
      setTrips(results);
      if (results.length === 0) {
        setError("No routes found for this date. Try expanding your search window.");
      }
    } catch (err) {
      setError("Failed to communicate with AstraCommand routing systems.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectTrip = (trip) => {
    // Pass the entire trip object securely through memory to the seat booking wizard
    navigate('/book-trip', { state: { trip } });
  };

  return (
    <div className="flight-search-page">
      <header className="page-header">
        <h1 className="text-cyan">Interplanetary Trip Planner</h1>
        <p>Map your journey across the solar system.</p>
      </header>

      {/* Temporary Search Form (To be replaced by 3D Globe) */}
      <form className="search-panel" onSubmit={handleSearch}>
        <div className="form-group">
          <label>Origin</label>
          <select value={origin} onChange={(e) => setOrigin(e.target.value)}>
            {ports.map(p => <option key={p.code} value={p.code}>{p.name} ({p.code})</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Destination</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)}>
            {ports.map(p => <option key={p.code} value={p.code}>{p.name} ({p.code})</option>)}
          </select>
        </div>

        <div className="form-group">
          <label>Departure Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? 'Calculating Trajectories...' : 'Search Routes'}
        </Button>
      </form>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Results Rendering */}
      <div className="results-container">
        {trips.map((trip, idx) => (
          <TripCard key={idx} trip={trip} onSelectTrip={handleSelectTrip} />
        ))}
      </div>
    </div>
  );
};

export default TripPlanningPage;