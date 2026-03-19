import React, { useState, useEffect } from 'react';
import { flightService } from '../../../services/flightService';
import Button from '../../../components/atoms/button/Button';
import FormField from '../../../components/molecules/form-field/FormField';
import Modal from '../../../components/organisms/modal/Modal';
import './AdminFlightOpsPage.css';

const FLIGHT_STATUSES = ['Scheduled', 'Delayed', 'Boarding', 'In Transit', 'Arrived', 'Cancelled'];

const AdminFlightOpsPage = () => {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal States
  const [activeFlight, setActiveFlight] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [newPrices, setNewPrices] = useState({ firstClassPrice: 0, businessPrice: 0, economyPrice: 0 });

  const fetchFlights = async (page = 0) => {
    setIsLoading(true);
    try {
      // Fetch all flights without filters, sorted by departure time
      const data = await flightService.searchFlights({ page, size: 10, sortBy: 'departure', sortDir: 'DESC' });
      setFlights(data.content || []);
      setCurrentPage(data.number || 0);
      setTotalPages(data.totalPages || 0);
    } catch (error) {
      console.error("Failed to fetch flights", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights(0);
  }, []);

  // --- Handlers for Status Update ---
  const openStatusModal = (flight) => {
    setActiveFlight(flight);
    setNewStatus(flight.status);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    try {
      await flightService.updateFlightStatus(activeFlight.id, newStatus);
      setIsStatusModalOpen(false);
      fetchFlights(currentPage); // Refresh the table
    } catch (error) {
      alert("Failed to update status. " + (error.response?.data?.message || ""));
    }
  };

  // --- Handlers for Price Update ---
  const openPriceModal = (flight) => {
    setActiveFlight(flight);
    setNewPrices({
      firstClassPrice: flight.firstClassPrice,
      businessPrice: flight.businessPrice,
      economyPrice: flight.economyPrice
    });
    setIsPriceModalOpen(true);
  };

  const handleSavePrices = async () => {
    try {
      await flightService.updateFlightPrices(activeFlight.id, newPrices);
      setIsPriceModalOpen(false);
      fetchFlights(currentPage); // Refresh the table
    } catch (error) {
      alert("Failed to update prices. " + (error.response?.data?.message || ""));
    }
  };

  return (
    <div className="admin-ops-page">
      <div className="admin-header">
        <h2>Flight Operations</h2>
        <Button variant="primary">Create New Flight</Button> {/* We can build this next! */}
      </div>

      <div className="admin-table-container">
        {isLoading ? (
          <p>Loading orbital schedules...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Flight #</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Status</th>
                <th>Prices (E / B / F)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight.id}>
                  <td><strong>{flight.flightNumber}</strong></td>
                  <td>{flight.origin.code} → {flight.destination.code}</td>
                  <td>{new Date(flight.departure).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${flight.status.toLowerCase().replace(' ', '_')}`}>
                      {flight.status}
                    </span>
                  </td>
                  <td>
                    ${flight.economyPrice} / ${flight.businessPrice} / ${flight.firstClassPrice}
                  </td>
                  <td className="action-cells">
                    <Button variant="secondary" onClick={() => openStatusModal(flight)} className="sm-btn">
                      Status
                    </Button>
                    <Button variant="secondary" onClick={() => openPriceModal(flight)} className="sm-btn">
                      Prices
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="admin-pagination">
          <Button disabled={currentPage === 0} onClick={() => fetchFlights(currentPage - 1)}>Prev</Button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <Button disabled={currentPage === totalPages - 1} onClick={() => fetchFlights(currentPage + 1)}>Next</Button>
        </div>
      )}

      {/* Update Status Modal */}
      <Modal 
        isOpen={isStatusModalOpen} 
        title={`Update Status: ${activeFlight?.flightNumber}`}
        onConfirm={handleSaveStatus}
        onCancel={() => setIsStatusModalOpen(false)}
        confirmText="Save Status"
      >
        <div className="form-field-molecule">
          <label>Select New Status</label>
          <select 
            className="form-input admin-select" 
            value={newStatus} 
            onChange={(e) => setNewStatus(e.target.value)}
          >
            {FLIGHT_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Update Prices Modal */}
      <Modal 
        isOpen={isPriceModalOpen} 
        title={`Update Prices: ${activeFlight?.flightNumber}`}
        onConfirm={handleSavePrices}
        onCancel={() => setIsPriceModalOpen(false)}
        confirmText="Save Prices"
      >
        <div className="price-inputs-grid">
          <FormField 
            id="economyPrice" 
            label="Economy Class ($)" 
            type="number" 
            min="0"
            value={newPrices.economyPrice} 
            onChange={(e) => setNewPrices({...newPrices, economyPrice: e.target.value})} 
          />
          <FormField 
            id="businessPrice" 
            label="Business Class ($)" 
            type="number" 
            min="0"
            value={newPrices.businessPrice} 
            onChange={(e) => setNewPrices({...newPrices, businessPrice: e.target.value})} 
          />
          <FormField 
            id="firstClassPrice" 
            label="First Class ($)" 
            type="number" 
            min="0"
            value={newPrices.firstClassPrice} 
            onChange={(e) => setNewPrices({...newPrices, firstClassPrice: e.target.value})} 
          />
        </div>
      </Modal>
    </div>
  );
};

export default AdminFlightOpsPage;