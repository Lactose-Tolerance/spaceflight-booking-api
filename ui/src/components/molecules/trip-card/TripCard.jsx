import React, { useState } from 'react';
import Button from '../../atoms/button/Button';
import FlightCard from '../flight-card/FlightCard';
import './TripCard.css';

const TripCard = ({ trip, onSelectTrip }) => {
  const [showLegs, setShowLegs] = useState(false);

  // Grab the first and last flight to show the overall journey
  const firstLeg = trip.legs[0];
  const lastLeg = trip.legs[trip.legs.length - 1];

  // Helper to format dates cleanly: "28 Mar 2026, 11:12 am"
  const formatDateTime = (dateString) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', ''); // Removes the comma to match your FlightCard style perfectly
  };

  return (
    <div className="trip-card">
      <div className="trip-summary">
        <div className="trip-route">
          <h2>{firstLeg.origin.code} <span>&#10142;</span> {lastLeg.destination.code}</h2>
          <p className="text-cyan">{trip.totalStops === 0 ? 'Direct Flight' : `${trip.totalStops} Layover(s)`}</p>
        </div>
        
        <div className="trip-details">
          {/* Now looking at .departure and .arrival instead of .departureTime */}
          <p><strong>Departure:</strong> {formatDateTime(firstLeg.departure)}</p>
          <p><strong>Arrival:</strong> {formatDateTime(lastLeg.arrival)}</p>
          <p><strong>Total Time:</strong> {trip.totalDurationHours} hrs</p>
        </div>

        <div className="trip-price-action">
          <h3>${trip.totalEconomyPrice.toLocaleString()} <span className="text-small">Econ</span></h3>
          <Button variant="primary" onClick={() => onSelectTrip(trip)}>
            Select Trip
          </Button>
        </div>
      </div>

      <div className="trip-toggle">
        <button className="toggle-btn text-cyan" onClick={() => setShowLegs(!showLegs)}>
          {showLegs ? 'Hide Flight Details ▲' : 'View Flight Details ▼'}
        </button>
      </div>

      {showLegs && (
        <div className="trip-legs">
          {trip.legs.map((leg, index) => (
            <div key={leg.id} className="leg-container">
              <div className="leg-indicator">Leg {index + 1}</div>
              {/* Passing the individual leg down to your existing FlightCard */}
              <FlightCard flight={leg} onBook={() => {}} /> 
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripCard;