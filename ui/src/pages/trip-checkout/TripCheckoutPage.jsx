import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import SeatCard from '../../components/molecules/seat-card/SeatCard';
import Button from '../../components/atoms/button/Button';
import Modal from '../../components/organisms/modal/Modal';
import './TripCheckoutPage.css';

const TripCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const trip = location.state?.trip;
  const selectedSeats = location.state?.selectedSeats;

  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  // Protect the route
  useEffect(() => {
    if (!trip || !selectedSeats) {
      navigate('/plan');
      return;
    }

    // Calculate dynamic total price based on the actual seat classes chosen
    const calculatedTotal = trip.legs.reduce((total, leg) => {
      const seat = selectedSeats[leg.id];
      if (!seat) return total;
      
      if (seat.classType === 'FIRST_CLASS') return total + leg.firstClassPrice;
      if (seat.classType === 'BUSINESS') return total + leg.businessPrice;
      return total + leg.economyPrice; // Default to economy
    }, 0);

    setTotalPrice(calculatedTotal);
  }, [trip, selectedSeats, navigate]);

  if (!trip || !selectedSeats) return null;

  const handlePaymentAndBooking = async () => {
    setIsProcessingPayment(true);
    setError(null);

    // Dummy timeout to simulate banking network processing
    setTimeout(async () => {
      try {
        // Sequential booking to prevent Hibernate Optimistic Locking errors
        for (const leg of trip.legs) {
          const seatToBook = selectedSeats[leg.id];
          await bookingService.bookSeat(seatToBook.id);
        }
        
        setIsProcessingPayment(false);
        setShowSuccessModal(true);
      } catch (err) {
        console.error("Booking Error:", err);
        setIsProcessingPayment(false);
        setError("Transaction failed. One of your selected seats may have been secured by another passenger.");
      }
    }, 2000);
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <Button variant="ghost" onClick={() => navigate(-1)} className="back-btn">
          ← Back to Seat Selection
        </Button>

        <h2>Secure Checkout</h2>

        {error && <div className="error-state checkout-error">{error}</div>}

        <div className="checkout-content">
          <div className="checkout-summary-column">
            {/* Render a SeatCard for every leg of the journey */}
            {trip.legs.map((leg, index) => (
              <div key={leg.id} className="leg-summary-card">
                <h4 className="text-cyan">Leg {index + 1}</h4>
                <SeatCard flight={leg} seat={selectedSeats[leg.id]} />
              </div>
            ))}
          </div>

          <div className="checkout-action-column">
            <div className="payment-simulation-box">
              <h3>Payment Information</h3>
              
              <div className="price-breakdown">
                <p>Total Itinerary Cost:</p>
                <h2 className="text-cyan">${totalPrice.toLocaleString()}</h2>
              </div>

              <p className="payment-disclaimer">
                This is a secure connection to the Interplanetary Banking Network. By clicking the button below, the funds will be withdrawn from your account.
              </p>
              
              <Button 
                variant="primary" 
                className="pay-btn" 
                onClick={handlePaymentAndBooking}
                disabled={isProcessingPayment}
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
        title="Journey Confirmed!"
        confirmText="View My Bookings"
        onConfirm={() => {
          setShowSuccessModal(false);
          navigate('/my-bookings'); 
        }}
      >
        Your payment was successful. All seats have been officially secured. Safe travels!
      </Modal>
    </div>
  );
};

export default TripCheckoutPage;