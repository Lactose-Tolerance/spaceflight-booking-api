import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import Button from '../../components/atoms/button/Button';
import './BoardingPassPage.css';

const BoardingPassPage = () => {
  const { reference } = useParams();
  const navigate = useNavigate();
  const [passData, setPassData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardingPass = async () => {
      try {
        const data = await bookingService.getBoardingPass(reference);
        setPassData(data);
      } catch (err) {
        setError("Could not retrieve boarding pass. Ensure you have the correct clearance.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBoardingPass();
  }, [reference]);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  if (isLoading) return <div className="pass-container"><div className="loading-state">Generating credentials...</div></div>;
  if (error) return <div className="pass-container"><div className="error-state">{error}</div></div>;
  if (!passData) return null;

  return (
    <div className="pass-container">
      <Button variant="ghost" onClick={() => navigate('/my-bookings')} className="back-btn">
        ← Back to Itinerary
      </Button>

      <div className="boarding-pass-ticket">
        {/* Header section with Passenger Name and Flight Number */}
        <div className="ticket-header">
          <div className="header-item">
            <span className="label">Passenger</span>
            {/* Populating from DTO[cite: 3] */}
            <span className="value">{passData.passengerName}</span> 
          </div>
          <div className="header-item text-right">
            <span className="label">Flight</span>
            {/* Populating from DTO[cite: 3] */}
            <span className="value flight-hl">{passData.flightNumber}</span>
          </div>
        </div>

        {/* Big Route Section using Origin/Destination fields[cite: 3] */}
        <div className="ticket-body">
          <div className="route-display">
            <div className="route-node">
              <span className="planet">{passData.originPlanet}</span>
              <span className="port-code">{passData.originCode}</span>
              <span className="port-name">{passData.originName}</span>
              <div className="time-group">
                <span className="date">{formatDate(passData.departureTime)}</span>
                <span className="time">{formatTime(passData.departureTime)}</span>
              </div>
            </div>

            <div className="route-icon">✈</div>

            <div className="route-node text-right">
              <span className="planet">{passData.destinationPlanet}</span>
              <span className="port-code">{passData.destinationCode}</span>
              <span className="port-name">{passData.destinationName}</span>
              <div className="time-group">
                <span className="date">{formatDate(passData.arrivalTime)}</span>
                <span className="time">{formatTime(passData.arrivalTime)}</span>
              </div>
            </div>
          </div>

          {/* Seat details using seat fields from DTO[cite: 3] */}
          <div className="seat-details-row">
            <div className="detail-box">
              <span className="label">Class</span>
              <span className="value">{passData.seatClass.replace('_', ' ')}</span>
            </div>
            <div className="detail-box">
              <span className="label">Seat</span>
              <span className="value giant-seat">{passData.seatNumber}</span>
            </div>
            <div className="detail-box">
              <span className="label">Gate</span>
              <span className="value">1A</span>
            </div>
          </div>
        </div>

        {/* Footer with Reference and Barcode[cite: 3] */}
        <div className="ticket-footer">
          <div className="reference-box">
            <span className="label">Booking Ref</span>
            <span className="value">{passData.bookingReference}</span>
          </div>
          <div className="barcode-dummy"></div>
        </div>
      </div>

      <div className="print-actions">
        <Button variant="secondary" onClick={() => window.print()}>
          🖨️ Print
        </Button>
      </div>
    </div>
  );
};

export default BoardingPassPage;