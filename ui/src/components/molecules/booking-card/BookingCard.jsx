import React from 'react';
import Button from '../../atoms/button/Button';
import './BookingCard.css';

const BookingCard = ({ booking, onCancelClick, onBoardingPassClick }) => {
  if (!booking) return null;

  const {
    bookingReference = 'N/A',
    flightNumber = 'N/A',
    origin = '???',
    destination = '???',
    departureTime,
    arrivalTime,
    seatNumber = 'N/A',
    seatClass = 'N/A',
    bookingTime,
    status = 'Confirmed'
  } = booking;

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const options = { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  const isBoardingAllowed = ['boarding', 'in transit', 'arrived'].includes(status.toLowerCase());
  const isCancelled = status.toLowerCase() === 'cancelled';

  return (
    <div className={`booking-card-molecule ${isCancelled ? 'booking-cancelled' : ''}`}>
      <div className="booking-card-header">
        <div className="booking-ref-group">
          <span className="ref-label">Booking Reference</span>
          <span className="ref-value">{bookingReference}</span>
        </div>
        <span className={`booking-status status-${status.toLowerCase()}`}>
          {status}
        </span>
      </div>

      <div className="booking-card-body">
        <div className="booking-route">
          <div className="route-point">
            <span className="point-code">{origin}</span>
            <span className="point-time">{formatDate(departureTime)}</span>
          </div>
          <div className="route-connector">➔</div>
          <div className="route-point text-right">
            <span className="point-code">{destination}</span>
            <span className="point-time">{formatDate(arrivalTime)}</span>
          </div>
        </div>

        <div className="booking-details-grid">
          <div className="detail-item">
            <span className="detail-label">Flight</span>
            <span className="detail-value">{flightNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Seat</span>
            <span className="detail-value highlight">{seatNumber}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Class</span>
            <span className="detail-value">{seatClass.replace('_', ' ')}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Booked On</span>
            <span className="detail-value">{formatDate(bookingTime)}</span>
          </div>
        </div>
      </div>

      {!isCancelled && (
        <div className="booking-card-footer">
          <Button variant="danger" onClick={() => onCancelClick(booking)}>
            Cancel Booking
          </Button>

          <Button
            variant={isBoardingAllowed ? "primary" : "secondary"} 
            disabled={!isBoardingAllowed || isCancelled}
            onClick={() => onBoardingPassClick(booking)}
          >
            {isBoardingAllowed ? 'View Boarding Pass' : 'Pass Unavailable'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;