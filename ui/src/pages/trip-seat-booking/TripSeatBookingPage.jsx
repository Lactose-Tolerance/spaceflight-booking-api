import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/atoms/button/Button';
import Seat from '../../components/atoms/seat/Seat'; // Reusing your Seat atom
import { seatService } from '../../services/seatService';
import { bookingService } from '../../services/bookingService';
import './TripSeatBookingPage.css';

const TripSeatBookingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const trip = location.state?.trip;

  const [currentLegIndex, setCurrentLegIndex] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState({}); 
  const [availableSeats, setAvailableSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingBooking, setProcessingBooking] = useState(false);
  const [error, setError] = useState('');

  // Protect the route
  useEffect(() => {
    if (!trip) {
      navigate('/plan');
    }
  }, [trip, navigate]);

  const currentFlight = trip?.legs[currentLegIndex];
  const isLastLeg = currentLegIndex === trip?.legs.length - 1;

  // Fetch seats whenever the leg changes
  useEffect(() => {
    if (!currentFlight) return;
    
    const fetchSeats = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await seatService.getSeatsForFlight(currentFlight.id);
        setAvailableSeats(data);
      } catch (err) {
        setError("Failed to load seat telemetry for this spacecraft.");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [currentFlight]);

  if (!trip || !currentFlight) return null;

  // Grouping logic adapted from your FlightSeatPage
  const groupSeatsByRow = () => {
    const rows = {};
    availableSeats.forEach(seat => {
      const rowNum = parseInt(seat.seatNumber, 10);
      if (!rows[rowNum]) rows[rowNum] = [];
      rows[rowNum].push(seat);
    });
    
    Object.keys(rows).forEach(rowNum => {
      rows[rowNum].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
    });
    
    return rows;
  };

  const handleSeatClick = (seat) => {
    if (seat.booked) return; 
    
    setSelectedSeats({
      ...selectedSeats,
      [currentFlight.id]: seat 
    });
  };

  const handleNextOrCheckout = async () => {
    const chosenSeat = selectedSeats[currentFlight.id];
    
    if (!chosenSeat) {
      setError("Please secure a seat before continuing.");
      return;
    }

    if (isLastLeg) {
      // Hand the data off to the new Checkout Page instead of booking directly
      navigate('/trip-checkout', { state: { trip, selectedSeats } });
    } else {
      setError('');
      setCurrentLegIndex(prev => prev + 1);
    }
  };

  const seatRows = groupSeatsByRow();
  const isFlightBookable = currentFlight.status.toLowerCase() === 'scheduled';

  // Helper to determine if a Seat atom should appear "Selected"
  const renderSeat = (seat) => {
    const isSelected = selectedSeats[currentFlight.id]?.id === seat.id;
    
    // We pass a synthetic "seat" object to the Seat component to force the styling 
    // without altering the underlying data structure
    const displaySeat = {
      ...seat,
      // If it's the selected seat, we force it to look 'booked' but we'll add a class in CSS
      isWizardSelected: isSelected
    };

    return (
      <div 
        key={seat.id} 
        onClick={() => handleSeatClick(seat)} 
        className={`seat-wrapper ${isSelected ? 'wizard-selected' : ''}`}
      >
        <Seat 
          seat={displaySeat} 
          onClick={() => {}} // We handle the click on the wrapper instead
          isFlightBookable={isFlightBookable}
        />
      </div>
    );
  };

  return (
    <div className="trip-seat-wizard seat-page-container">
      
      <header className="wizard-header">
        <div className="progress-indicator">
          <span className="text-cyan">Leg {currentLegIndex + 1} of {trip.legs.length}</span>
        </div>
        <h1>{currentFlight.origin.code} <span>&#10142;</span> {currentFlight.destination.code}</h1>
        <p>Flight: {currentFlight.flightNumber} | Depart: {new Date(currentFlight.departure).toLocaleString()}</p>
      </header>

      {error && <div className="flight-status-warning">{error}</div>}
      {!isFlightBookable && !error && (
        <div className="flight-status-warning">
          This flight is currently {currentFlight.status}. Seat booking is only available for Scheduled flights.
        </div>
      )}

      <div className="seat-map-section">
        {loading ? (
          <div className="loading-state" style={{textAlign: 'center', padding: '3rem'}}>Loading orbital schematics...</div>
        ) : (
          <>
            <h2>Select Your Seat</h2>
            <div className="seat-legend">
              <div className="legend-item"><div className="legend-box free"></div> Available</div>
              <div className="legend-item"><div className="legend-box booked"></div> Booked</div>
              <div className="legend-item"><div className="legend-box wizard-selected-legend"></div> Selected</div>
            </div>

            <div className="seat-grid-container">
              <div className="fuselage">
                {Object.keys(seatRows).sort((a, b) => a - b).map((rowNum) => {
                  const rowSeats = seatRows[rowNum];
                  const hasAisle = rowSeats.length > 2;
                  const middleIndex = Math.ceil(rowSeats.length / 2);

                  return (
                    <div key={`row-${rowNum}`} className="seat-row">
                      <span className="row-number">{rowNum}</span>
                      
                      <div className="seat-group">
                        {rowSeats.slice(0, hasAisle ? middleIndex : rowSeats.length).map(renderSeat)}
                      </div>
                      
                      {hasAisle && <div className="aisle"></div>}
                      
                      {hasAisle && (
                        <div className="seat-group">
                          {rowSeats.slice(middleIndex).map(renderSeat)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>

      <footer className="wizard-footer">
        <div className="selection-summary">
          {selectedSeats[currentFlight.id] ? (
            <p>Selected Seat: <strong className="text-cyan">{selectedSeats[currentFlight.id].seatNumber}</strong></p>
          ) : (
            <p>Awaiting seat selection...</p>
          )}
        </div>
        
        <div className="wizard-actions">
          {currentLegIndex > 0 && (
            <Button variant="secondary" onClick={() => setCurrentLegIndex(prev => prev - 1)} disabled={processingBooking}>
              Previous Leg
            </Button>
          )}
          <Button variant="primary" onClick={handleNextOrCheckout} disabled={processingBooking || loading || !isFlightBookable}>
            {processingBooking ? 'Confirming...' : (isLastLeg ? 'Proceed to Checkout' : 'Next Leg')}
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default TripSeatBookingPage;