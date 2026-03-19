import React from 'react';
import Button from '../../atoms/button/Button';
import './FlightCard.css';

const FlightCard = ({ flight, onSelect }) => {
  // Helper to format "2026-04-10T08:00" into a human-readable string
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine status color based on your variables
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'scheduled': return 'status-scheduled'; // Cyan
      case 'boarding': return 'status-boarding';   // Green
      case 'delayed': return 'status-delayed';     // Danger/Red
      case 'in transit': return 'status-in_transit';  // Maybe we just use standard text for this
      case 'arrived': return 'status-arrived';       // Maybe we just use standard text for this
      case 'cancelled': return 'status-cancelled';   // Maybe we just use standard text for this
      default: return '';
    }
  };

  return (
    <div className="flight-card-molecule">
      <div className="flight-card-header">
        <span className="flight-number">{flight.flightNumber}</span>
        <span className={`flight-status ${getStatusClass(flight.status)}`}>
          {flight.status}
        </span>
      </div>

      <div className="flight-card-body">
        {/* Origin Section */}
        <div className="flight-location">
          <span className="planet-name">{flight.origin.planet}</span>
          <span className="port-code">{flight.origin.code}</span>
          <span className="port-name">{flight.origin.name}</span>
          <span className="flight-time">{formatDate(flight.departure)}</span>
        </div>

        {/* Visual Connector */}
        <div className="flight-connector">
          <div className="connector-line"></div>
          <span className="connector-icon">🚀</span>
        </div>

        {/* Destination Section */}
        <div className="flight-location text-right">
          <span className="planet-name">{flight.destination.planet}</span>
          <span className="port-code">{flight.destination.code}</span>
          <span className="port-name">{flight.destination.name}</span>
          <span className="flight-time">{formatDate(flight.arrival)}</span>
        </div>
      </div>

      <div className="flight-card-footer">
        <Button variant="primary" onClick={() => onSelect(flight)}>
          Select Flight
        </Button>
      </div>
    </div>
  );
};

export default FlightCard;