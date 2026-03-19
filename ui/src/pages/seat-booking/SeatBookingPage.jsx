import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flightService } from '../../services/flightService';
import { seatService } from '../../services/seatService';
import { bookingService } from '../../services/bookingService';
import SeatCard from '../../components/molecules/seat-card/SeatCard';
import Button from '../../components/atoms/button/Button';
import Modal from '../../components/organisms/modal/Modal';
import './SeatBookingPage.css';

const SeatBookingPage = () => {
  const { flightId, seatId } = useParams();
  const navigate = useNavigate();

  const [flight, setFlight] = useState(null);
  const [seat, setSeat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Clear any previous errors
      try {
        const [flightData, seatData] = await Promise.all([
          flightService.getFlightById(flightId),
          seatService.getSeatById(seatId)
        ]);

        // VALIDATION 1: Ensure the seat actually belongs to this flight
        // (Checking both direct 'flightId' and nested 'flight.id' just in case based on your backend DTO)
        const seatFlightId = seatData.flight?.id || seatData.flightId || seatData.flight;
        if (seatFlightId && seatFlightId.toString() !== flightId.toString()) {
            setError("Security Alert: This seat does not belong to the selected flight. Please return to the flight list.");
            return; // Stop execution, don't set flight/seat state
        }

        // Set the state so the card can render
        setFlight(flightData);
        setSeat(seatData);

        // VALIDATION 2: Check if seat is already booked
        if (seatData.booked) {
            setError("This seat has already been booked by another passenger. Please select a different seat.");
        }

      } catch (err) {
        setError("Failed to load booking details. The flight or seat may not exist.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [flightId, seatId]);

  const handlePaymentAndBooking = async () => {
    setIsProcessingPayment(true);
    setError(null);

    setTimeout(async () => {
      try {
        await bookingService.bookSeat(seatId);
        setIsProcessingPayment(false);
        setShowSuccessModal(true);
      } catch (err) {
        setIsProcessingPayment(false);
        setError(err.response?.data?.message || "Payment succeeded, but booking failed. Please contact support.");
      }
    }, 2000);
  };

  // Hard error state for mismatches or API failures (hides the checkout UI completely)
  if (isLoading) return <div className="checkout-page"><div className="loading-state">Initializing secure checkout...</div></div>;
  if (error && !flight) return <div className="checkout-page"><div className="error-state">{error}</div></div>;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <Button variant="ghost" onClick={() => navigate(`/flights/${flightId}/seats`)} className="back-btn">
          ← Back to Seat Map
        </Button>

        <h2>Secure Checkout</h2>

        {/* Display inline error for things like "Already Booked" */}
        {error && <div className="error-state checkout-error">{error}</div>}

        <div className="checkout-content">
          <div className="checkout-summary-column">
            <SeatCard flight={flight} seat={seat} />
          </div>

          <div className="checkout-action-column">
            <div className="payment-simulation-box">
              <h3>Payment Information</h3>
              <p className="payment-disclaimer">
                This is a secure connection to the Interplanetary Banking Network. By clicking the button below, the funds will be withdrawn from your account.
              </p>
              
              <Button 
                variant="primary" 
                className="pay-btn" 
                onClick={handlePaymentAndBooking}
                /* DISABLING LOGIC: Disable if processing OR if seat is already booked */
                disabled={isProcessingPayment || seat?.booked}
              >
                {isProcessingPayment ? 'Processing Transaction...' : 'Confirm & Pay'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        variant="info"
        title="Booking Confirmed!"
        confirmText="View My Bookings"
        onConfirm={() => {
          setShowSuccessModal(false);
          navigate('/my-bookings'); 
        }}
      >
        Your payment was successful and seat <strong>{seat?.seatNumber}</strong> on flight <strong>{flight?.flightNumber}</strong> is officially secured. Safe travels!
      </Modal>
    </div>
  );
};

export default SeatBookingPage;