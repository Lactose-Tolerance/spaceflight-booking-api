import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TripGlobe from '../../components/organisms/trip-globe/TripGlobe'; 
import TripCard from '../../components/molecules/trip-card/TripCard';
import Button from '../../components/atoms/button/Button';
import FormField from '../../components/molecules/form-field/FormField';
import { tripService } from '../../services/tripService';
import { portService, planetService } from '../../services/portService';
import '../trip-planning/TripPlanningPage.css';

const TripPlanningPage = () => {
  const navigate = useNavigate();
  const [ports, setPorts] = useState([]);
  const [planets, setPlanets] = useState([]);
  const [origin, setOrigin] = useState(''); 
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('2026-03-23');
  
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portsData, planetsData] = await Promise.all([
          portService.getAllPorts(),
          planetService.getAllPlanets()
        ]);
        setPorts(portsData);
        setPlanets(planetsData);
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!date) {
      setError("Please select a valid departure date.");
      return;
    }

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

  const handleSelectTrip = (trip) => navigate('/book-trip', { state: { trip } });

  return (
    <div className="flight-search-page">
      <header className="page-header">
        <h1 className="text-cyan">Interplanetary Trip Planner</h1>
        <p>Select your route via the Solar System interface, or enter the port codes manually.</p>
      </header>

      {ports.length > 0 && (
        <TripGlobe 
          ports={ports}
          planets={planets}
          origin={origin}
          destination={destination}
          setOrigin={setOrigin}
          setDestination={setDestination}
        />
      )}

      <div className="trip-control-panel">
        
        <FormField
          id="origin-port"
          label="Origin Port"
          list="ports-list"
          value={origin}
          onChange={(e) => setOrigin(e.target.value.toUpperCase())}
          placeholder="Type Name or Code..."
        />

        <FormField
          id="dest-port"
          label="Destination Port"
          list="ports-list" 
          value={destination}
          onChange={(e) => setDestination(e.target.value.toUpperCase())}
          placeholder="Type Name or Code..."
        />

        <FormField
          id="departure-date"
          label="Departure Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="button-group">
          <Button 
            variant="primary" 
            onClick={handleSearch} 
            disabled={loading || !origin || !destination || !date}
            style={{ width: '100%', height: '100%' }}
          >
            {loading ? 'Searching...' : 'Search Trip'}
          </Button>
        </div>

      </div>

      <datalist id="ports-list">
        {ports.map(p => (
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </datalist>

      {error && <div className="error-message" style={{ marginTop: '20px' }}>{error}</div>}

      <div className="results-container" style={{ marginTop: '40px' }}>
        {trips.map((trip, idx) => (
          <TripCard key={idx} trip={trip} onSelectTrip={handleSelectTrip} />
        ))}
      </div>
    </div>
  );
};

export default TripPlanningPage;