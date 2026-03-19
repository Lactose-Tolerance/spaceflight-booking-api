import React from 'react';
import './Seat.css';

const Seat = ({ seat, onClick, isFlightBookable = true }) => {
  const { seatNumber, booked, classType } = seat;

  const isSelectable = !booked && isFlightBookable;

  return (
    <button 
      className={`seat-atom ${booked ? 'seat-booked' : 'seat-free'} ${classType.toLowerCase()}`}
      disabled={!isSelectable}
      onClick={() => onClick(seat)}
      title={`${classType.replace('_', ' ')} - ${booked ? 'Booked' : (isFlightBookable ? 'Available' : 'Booking Closed')}`}
    >
      <span className="seat-number">{seatNumber}</span>
    </button>
  );
};

export default Seat;