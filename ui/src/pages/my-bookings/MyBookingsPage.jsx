import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import BookingCard from '../../components/molecules/booking-card/BookingCard';
import Modal from '../../components/organisms/modal/Modal';
import Button from '../../components/atoms/button/Button';
import './MyBookingsPage.css';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      // Sort bookings so newest are at the top
      const sorted = data.sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate));
      setBookings(sorted);
    } catch (err) {
      setError("Failed to load your bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Open the modal and set which booking we are targeting
  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  // Actually hit the API to cancel
  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    
    setIsCancelling(true);
    try {
      await bookingService.cancelBooking(bookingToCancel.bookingReference);
      // Refresh the list to reflect the cancelled status
      await fetchBookings();
      setIsCancelModalOpen(false);
      setBookingToCancel(null);
    } catch (err) {
      console.error("Failed to cancel:", err);
      alert(err.response?.data?.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleBoardingPassClick = (booking) => {
    navigate(`/boarding-pass/${booking.bookingReference}`);
  }

  return (
    <div className="my-bookings-page">
      <div className="page-header">
        <h1>My Bookings</h1>
        <p>Manage your upcoming and past interplanetary travels.</p>
        <Button variant="ghost" onClick={() => navigate('/flights')} className="mt-1">
          + Search New Flights
        </Button>
      </div>

      {isLoading && <div className="loading-state">Retrieving your itinerary...</div>}
      {error && <div className="error-state">{error}</div>}

      {!isLoading && !error && bookings.length === 0 && (
        <div className="empty-state">
          You have no active bookings. Time to explore the stars!
        </div>
      )}

      {!isLoading && !error && bookings.length > 0 && (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <BookingCard 
              key={booking.bookingReference} 
              booking={booking} 
              onCancelClick={handleCancelClick} 
              onBoardingPassClick={handleBoardingPassClick}
            />
          ))}
        </div>
      )}

      {/* The Danger Modal Organism! */}
      <Modal
        isOpen={isCancelModalOpen}
        variant="danger"
        title="Cancel Booking?"
        confirmText={isCancelling ? "Cancelling..." : "Yes, Cancel Flight"}
        cancelText="Keep Booking"
        onCancel={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      >
        Are you absolutely sure you want to cancel booking <strong>{bookingToCancel?.bookingReference}</strong>? 
        This will release seat <strong>{bookingToCancel?.seat?.seatNumber}</strong> back to the public. 
        <br/><br/>
        <em>This action cannot be undone.</em>
      </Modal>
    </div>
  );
};

export default MyBookingsPage;