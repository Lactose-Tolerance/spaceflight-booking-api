import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightService } from '../../services/flightService';
import { seatService } from '../../services/seatService';
import FlightCard from '../../components/molecules/flight-card/FlightCard';
import Seat from '../../components/atoms/seat/Seat';
import Button from '../../components/atoms/button/Button';
import './FlightSeatPage.css';

const FlightSeatPage = () => {
  const { flightId } = useParams(); // Get the ID from the URL
  const navigate = useNavigate();
  
  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFlightAndSeats = async () => {
      setIsLoading(true);
      try {
        // Fetch both concurrently for speed
        const [flightData, seatsData] = await Promise.all([
          flightService.getFlightById(flightId),
          seatService.getSeatsForFlight(flightId)
        ]);
        
        setFlight(flightData);
        setSeats(seatsData);
      } catch (err) {
        setError("Could not load flight details or seat map.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlightAndSeats();
  }, [flightId]);

  const handleSeatClick = (seat) => {
    console.log("Navigating to booking for seat:", seat.seatNumber);
    // Placeholder for future navigation:
    // navigate(`/book/seat/${seat.id}`);
  };

  // Group seats by row number (e.g., "1A" -> Row 1)
  const groupSeatsByRow = () => {
    const rows = {};
    seats.forEach(seat => {
      // Extract the numbers from the seat string (e.g., "12B" -> 12)
      const rowNum = parseInt(seat.seatNumber, 10);
      if (!rows[rowNum]) rows[rowNum] = [];
      rows[rowNum].push(seat);
    });
    
    // Sort seats within each row alphabetically (A, B, C...)
    Object.keys(rows).forEach(rowNum => {
      rows[rowNum].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
    });
    
    return rows;
  };

  if (isLoading) return <div className="seat-page-container"><div className="loading-state">Loading orbital schematics...</div></div>;
  if (error) return <div className="seat-page-container"><div className="error-state">{error}</div></div>;
  if (!flight) return null;

  const seatRows = groupSeatsByRow();

  const isFlightBookable = flight.status.toLowerCase() === 'scheduled';

  return (
    <div className="seat-page-container">
      <div className="seat-page-header">
        <Button variant="ghost" onClick={() => navigate('/flights')}>
          ← Back to Flights
        </Button>
      </div>

      <div className="seat-page-flight-card">
        <FlightCard flight={flight} onSelect={() => {}} />
      </div>

      <div className="seat-map-section">
        
        {/* NEW: Warning Banner if the flight isn't scheduled */}
        {!isFlightBookable && (
          <div className="flight-status-warning">
            This flight is currently {flight.status}. Seat booking is only available for Scheduled flights.
          </div>
        ) || 
        (
          <div>
            <h2>Select Your Seat</h2>
          
            <div className="seat-legend">
              <div className="legend-item">
                <div className="legend-box free"></div> Available
              </div>
              <div className="legend-item">
                <div className="legend-box booked"></div> Booked
              </div>
            </div>
          </div>
        )}

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
                    {rowSeats.slice(0, hasAisle ? middleIndex : rowSeats.length).map(seat => (
                      <Seat 
                        key={seat.id} 
                        seat={seat} 
                        onClick={handleSeatClick} 
                        isFlightBookable={isFlightBookable} // PASSING THE PROP HERE
                      />
                    ))}
                  </div>
                  
                  {hasAisle && <div className="aisle"></div>}
                  
                  {hasAisle && (
                    <div className="seat-group">
                      {rowSeats.slice(middleIndex).map(seat => (
                        <Seat 
                          key={seat.id} 
                          seat={seat} 
                          onClick={handleSeatClick} 
                          isFlightBookable={isFlightBookable} // AND HERE
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlightSeatPage;