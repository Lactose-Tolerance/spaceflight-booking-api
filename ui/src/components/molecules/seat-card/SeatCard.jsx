import React from 'react';
import './SeatCard.css';

const SeatCard = ({ flight, seat }) => {
  if (!flight || !seat) return null;

  const getPrice = () => {
    switch (seat.classType.toUpperCase()) {
      case 'FIRST_CLASS': return flight.firstClassPrice;
      case 'BUSINESS': return flight.businessPrice;
      case 'ECONOMY': return flight.economyPrice;
      default: return 0;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatClassType = (type) => {
    return type.replace('_', ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className="seat-card-molecule">
      <div className="seat-card-header">
        <h4>Booking Summary</h4>
        <span className="flight-number">{flight.flightNumber}</span>
      </div>
      
      <div className="seat-card-body">
        <div className="summary-row">
          <span className="summary-label">Route</span>
          <span className="summary-value">{flight.origin.code} ➔ {flight.destination.code}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Seat</span>
          <span className="summary-value highlight">{seat.seatNumber}</span>
        </div>
        <div className="summary-row">
          <span className="summary-label">Class</span>
          <span className="summary-value">{formatClassType(seat.classType)}</span>
        </div>
      </div>

      <div className="seat-card-footer">
        <span className="total-label">Total Price</span>
        <span className="total-price">{formatCurrency(getPrice())}</span>
      </div>
    </div>
  );
};

export default SeatCard;