import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../../../services/bookingService';
import { flightService } from '../../../services/flightService'; // <-- Import flight service
import Button from '../../../components/atoms/button/Button';
import FormField from '../../../components/molecules/form-field/FormField';
import Modal from '../../../components/organisms/modal/Modal';
import FlightCard from '../../../components/molecules/flight-card/FlightCard'; // <-- Import FlightCard
import './AdminManifestPage.css';

const AdminManifestPage = () => {
  const { flightId } = useParams();
  const navigate = useNavigate();
  
  const [manifest, setManifest] = useState([]);
  const [flight, setFlight] = useState(null); // <-- New state for the flight
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

  // Fetch both the manifest AND the flight details simultaneously
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [manifestData, flightData] = await Promise.all([
        bookingService.getFlightManifest(flightId),
        flightService.getFlightById(flightId)
      ]);
      setManifest(manifestData || []);
      setFlight(flightData);
    } catch (error) {
      console.error("Failed to fetch data", error);
      alert("Error loading data. Make sure you have Admin privileges.");
    } finally {
      setIsLoading(false);
    }
  };

  const openCancelModal = (booking) => {
    setBookingToCancel(booking);
    setIsCancelModalOpen(true);
  };

  const confirmCancelBooking = async () => {
    try {
      await bookingService.cancelBooking(bookingToCancel.bookingReference);
      setIsCancelModalOpen(false);
      fetchData(); 
    } catch (error) {
      alert("Failed to cancel booking: " + (error.response?.data?.message || ""));
    }
  };

  const filteredManifest = manifest.filter(booking => {
    const matchesSearch = 
      (booking.passengerName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.seatNumber.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesClass = classFilter === 'ALL' || booking.seatClass === classFilter;
    
    return matchesSearch && matchesClass;
  });

  const totalBooked = manifest.length;
  const firstClassCount = manifest.filter(b => b.seatClass === 'FIRST_CLASS').length;
  const businessCount = manifest.filter(b => b.seatClass === 'BUSINESS').length;
  const econCount = manifest.filter(b => b.seatClass === 'ECONOMY').length;

  return (
    <div className="admin-ops-page">
      <div className="admin-header">
        <div>
          <Button variant="ghost" onClick={() => navigate('/admin/flights')} style={{ marginBottom: '1rem', padding: '0' }}>
            ← Back to Flights
          </Button>
          <h2>Passenger Manifest</h2>
        </div>
        <Button variant="secondary" onClick={() => window.print()}>Print Manifest</Button>
      </div>

      {/* --- Print-Only Simplified Flight Header --- */}
      {flight && (
        <div className="print-only-flight-header">
          <h3>FLIGHT: {flight.flightNumber} | {flight.origin?.code} → {flight.destination?.code}</h3>
          <p>Departure: {new Date(flight.departure).toLocaleString()}</p>
        </div>
      )}

      {/* --- Visual Flight Card (Hidden on Print) --- */}
      <div className="manifest-flight-card-wrapper">
        {isLoading ? <p>Loading flight data...</p> : flight && <FlightCard flight={flight} />}
      </div>

      {/* Metrics Bar */}
      <div className="manifest-metrics">
        <div className="metric-box">
          <span className="metric-label">Total Booked</span>
          <span className="metric-value">{totalBooked}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">First Class</span>
          <span className="metric-value">{firstClassCount}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Business</span>
          <span className="metric-value">{businessCount}</span>
        </div>
        <div className="metric-box">
          <span className="metric-label">Economy</span>
          <span className="metric-value">{econCount}</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="manifest-search-bar">
        <FormField id="search" label="Search Passenger, Ref, or Seat" placeholder="e.g. John Doe, REF123, 12A" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <div className="form-field-molecule">
          <label>Seat Class</label>
          <select className="form-input" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="ALL">All Classes</option>
            <option value="FIRST_CLASS">First Class</option>
            <option value="BUSINESS">Business</option>
            <option value="ECONOMY">Economy</option>
          </select>
        </div>
      </div>

      {/* Manifest Table */}
      <div className="admin-table-container">
        {isLoading ? (
          <p className="admin-table-msg">Loading passenger data...</p>
        ) : filteredManifest.length === 0 ? (
          <p className="admin-table-msg empty">No passengers found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Passenger Name</th>
                <th>Reference</th>
                <th>Seat</th>
                <th>Class</th>
                <th>Booking Time</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredManifest.map(booking => (
                <tr key={booking.bookingReference}>
                  <td><strong>{booking.passengerName || 'Unknown User'}</strong></td>
                  <td style={{ fontFamily: 'monospace', color: 'var(--color-cyan-500)' }}>{booking.bookingReference}</td>
                  <td><strong>{booking.seatNumber}</strong></td>
                  <td>
                    <span className={`status-badge status-${booking.seatClass.toLowerCase()}`}>
                      {booking.seatClass.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="coords-cell">{new Date(booking.bookingTime).toLocaleString()}</td>
                  <td className="action-cells">
                    <Button variant="secondary" onClick={() => openCancelModal(booking)} className="sm-btn delete-btn">
                      Cancel Ticket
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isCancelModalOpen} variant="danger" title={`Cancel Ticket: ${bookingToCancel?.bookingReference}?`} onConfirm={confirmCancelBooking} onCancel={() => setIsCancelModalOpen(false)} confirmText="Yes, Cancel Booking" cancelText="Keep Ticket">
        <div className="danger-modal-text">
          <p>Are you sure you want to cancel the ticket for <strong>{bookingToCancel?.passengerName}</strong> (Seat {bookingToCancel?.seatNumber})?</p>
          <p className="danger-modal-warning">Warning: This action will permanently delete the booking and immediately free up seat {bookingToCancel?.seatNumber} for other passengers to purchase.</p>
        </div>
      </Modal>

    </div>
  );
};

export default AdminManifestPage;