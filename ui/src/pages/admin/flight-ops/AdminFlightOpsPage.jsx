import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../../../services/flightService';
import Button from '../../../components/atoms/button/Button';
import FormField from '../../../components/molecules/form-field/FormField';
import Modal from '../../../components/organisms/modal/Modal';
import CreateFlightModal from '../../../components/organisms/create-flight/CreateFlightModal';
import './AdminFlightOpsPage.css';

const getCurrentDateTimeLocal = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

// For the Update Status Modal dropdown
const FLIGHT_STATUSES = ['Scheduled', 'Delayed', 'Boarding', 'In Transit', 'Arrived', 'Cancelled'];

// For the Search Checkboxes
const SEARCH_STATUSES = [
  { id: 'SCHEDULED', label: 'Scheduled' },
  { id: 'DELAYED', label: 'Delayed' },
  { id: 'BOARDING', label: 'Boarding' },
  { id: 'IN_TRANSIT', label: 'In Transit' },
  { id: 'ARRIVED', label: 'Arrived' },
  { id: 'CANCELLED', label: 'Cancelled' }
];

const AdminFlightOpsPage = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // --- Search & Filter State ---
  const [searchParams, setSearchParams] = useState({
    flightNumber: '', origin: '', destination: '', originPlanet: '', destinationPlanet: '', departure: getCurrentDateTimeLocal(), arrival: '', status: [],
  });
  const [sortConfig, setSortConfig] = useState({ sortBy: 'departure', sortDir: 'ASC' });

  // --- Modal States ---
  const [activeFlight, setActiveFlight] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const [newPrices, setNewPrices] = useState({ firstClassPrice: 0, businessPrice: 0, economyPrice: 0 });

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);

  // --- Core Fetch Function ---
  const fetchFlights = async (pageIndex = 0, params = searchParams, sort = sortConfig) => {
    setIsLoading(true);
    try {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== '')
      );
      
      const data = await flightService.searchFlights({ 
        ...cleanParams, 
        page: pageIndex, 
        size: 10, 
        sortBy: sort.sortBy, 
        sortDir: sort.sortDir 
      });
      
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Search Handlers ---
  const handleSearchInputChange = (e) => {
    const { id, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusFilterChange = (statusId) => {
    setSearchParams((prev) => {
      const currentStatuses = prev.status;
      if (currentStatuses.includes(statusId)) {
        return { ...prev, status: currentStatuses.filter(s => s !== statusId) };
      } else {
        return { ...prev, status: [...currentStatuses, statusId] };
      }
    });
  };

  const handleSortChange = (e) => {
    const { id, value } = e.target;
    setSortConfig(prev => ({ ...prev, [id]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFlights(0, searchParams, sortConfig);
  };

  const clearFilters = () => {
    const cleared = { flightNumber: '', origin: '', destination: '', originPlanet: '', destinationPlanet: '', departure: '', arrival: '', status: [] };
    const defaultSort = { sortBy: 'departure', sortDir: 'ASC' };
    setSearchParams(cleared);
    setSortConfig(defaultSort);
    fetchFlights(0, cleared, defaultSort);
  };

  // --- Modal Handlers ---
  const openStatusModal = (flight) => {
    setActiveFlight(flight);
    setNewStatus(flight.status);
    setIsStatusModalOpen(true);
  };

  const handleSaveStatus = async () => {
    try {
      await flightService.updateFlightStatus(activeFlight.id, newStatus);
      setIsStatusModalOpen(false);
      fetchFlights(currentPage); 
    } catch (error) {
      alert("Failed to update status. " + (error.response?.data?.message || ""));
    }
  };

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
      fetchFlights(currentPage); 
    } catch (error) {
      alert("Failed to update prices. " + (error.response?.data?.message || ""));
    }
  };

  const openDeleteModal = (flight) => {
    setFlightToDelete(flight);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteFlight = async () => {
    try {
      await flightService.deleteFlight(flightToDelete.id);
      setIsDeleteModalOpen(false);
      if (flights.length === 1 && currentPage > 0) {
        fetchFlights(currentPage - 1);
      } else {
        fetchFlights(currentPage); 
      }
    } catch (error) {
      alert("Failed to delete flight: " + (error.response?.data?.message || ""));
    }
  };

  return (
    <div className="admin-ops-page">
      <div className="admin-header">
        <h2>Flight Operations</h2>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>Create New Flight</Button>
      </div>

      {/* --- Search & Filter Bar --- */}
      <form className="admin-search-container" onSubmit={handleSearchSubmit}>
        <div className="admin-search-grid">
          
          <div className="admin-filters-section">
            <h3 className="section-title">Filter Flights</h3>
            <div className="filter-row halves">
              <FormField id="flightNumber" label="Flight Number" value={searchParams.flightNumber} onChange={handleSearchInputChange} />
              <FormField id="origin" label="Origin Code" value={searchParams.origin} onChange={handleSearchInputChange} />
              <FormField id="destination" label="Dest. Code" value={searchParams.destination} onChange={handleSearchInputChange} />
              <FormField id="departure" label="Departure After" type="datetime-local" value={searchParams.departure} onChange={handleSearchInputChange} />
            </div>

            <div className="admin-status-checkboxes">
              <label className="status-group-label">Status Filters:</label>
              <div className="checkbox-row">
                {SEARCH_STATUSES.map(status => (
                  <label key={status.id} className="checkbox-label">
                    <input 
                      type="checkbox" 
                      checked={searchParams.status.includes(status.id)} 
                      onChange={() => handleStatusFilterChange(status.id)} 
                    />
                    {status.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-sort-section">
            <h3 className="section-title">Sort Results</h3>
            <div className="filter-row full-width">
              <div className="form-field-molecule">
                <label htmlFor="sortBy">Sort By</label>
                <select id="sortBy" value={sortConfig.sortBy} onChange={handleSortChange} className="form-input">
                  <option value="departure">Departure Time</option>
                  <option value="flightNumber">Flight Number</option>
                  <option value="economyPrice">Economy Price</option>
                </select>
              </div>
              <div className="form-field-molecule">
                <label htmlFor="sortDir">Order</label>
                <select id="sortDir" value={sortConfig.sortDir} onChange={handleSortChange} className="form-input">
                  <option value="DESC">Newest First</option>
                  <option value="ASC">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

        </div>

        <div className="admin-search-actions">
          <Button type="button" variant="ghost" onClick={clearFilters}>Clear Filters</Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Apply Filters'}
          </Button>
        </div>
      </form>

      {/* --- Data Table --- */}
      <div className="admin-table-container">
        {isLoading ? (
          <p style={{ padding: '1rem' }}>Loading orbital schedules...</p>
        ) : flights.length === 0 ? (
          <p style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>No flights found matching criteria.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Flight #</th>
                <th>Route</th>
                <th>Departure</th>
                <th>Status</th>
                <th>Prices (E/B/F)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map(flight => (
                <tr key={flight.id}>
                  <td><strong>{flight.flightNumber}</strong></td>
                  <td>{flight.origin?.code} → {flight.destination?.code}</td>
                  <td>{new Date(flight.departure).toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${flight.status.toLowerCase().replace(' ', '_')}`}>
                      {flight.status}
                    </span>
                  </td>
                  <td>${flight.economyPrice} / ${flight.businessPrice} / ${flight.firstClassPrice}</td>
                  <td className="action-cells">
                    <Button variant="primary" onClick={() => navigate(`/admin/flights/${flight.id}/manifest`)} className="sm-btn">Manifest</Button>
                    <Button variant="secondary" onClick={() => openStatusModal(flight)} className="sm-btn">Status</Button>
                    <Button variant="secondary" onClick={() => openPriceModal(flight)} className="sm-btn">Prices</Button>
                    <Button variant="secondary" onClick={() => openDeleteModal(flight)} className="sm-btn delete-btn">Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Pagination --- */}
      {!isLoading && totalPages > 1 && (
        <div className="admin-pagination">
          <Button disabled={currentPage === 0} onClick={() => fetchFlights(currentPage - 1)}>Prev</Button>
          <span>Page {currentPage + 1} of {totalPages}</span>
          <Button disabled={currentPage === totalPages - 1} onClick={() => fetchFlights(currentPage + 1)}>Next</Button>
        </div>
      )}

      {/* --- Modals --- */}
      <Modal isOpen={isStatusModalOpen} title={`Update Status: ${activeFlight?.flightNumber}`} onConfirm={handleSaveStatus} onCancel={() => setIsStatusModalOpen(false)} confirmText="Save Status">
        <div className="form-field-molecule">
          <label>Select New Status</label>
          <select className="form-input admin-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {FLIGHT_STATUSES.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
      </Modal>

      <Modal isOpen={isPriceModalOpen} title={`Update Prices: ${activeFlight?.flightNumber}`} onConfirm={handleSavePrices} onCancel={() => setIsPriceModalOpen(false)} confirmText="Save Prices">
        <div className="price-inputs-grid">
          <FormField id="economyPrice" label="Economy Class ($)" type="number" min="0" value={newPrices.economyPrice} onChange={(e) => setNewPrices({...newPrices, economyPrice: e.target.value})} />
          <FormField id="businessPrice" label="Business Class ($)" type="number" min="0" value={newPrices.businessPrice} onChange={(e) => setNewPrices({...newPrices, businessPrice: e.target.value})} />
          <FormField id="firstClassPrice" label="First Class ($)" type="number" min="0" value={newPrices.firstClassPrice} onChange={(e) => setNewPrices({...newPrices, firstClassPrice: e.target.value})} />
        </div>
      </Modal>

      <Modal isOpen={isDeleteModalOpen} variant="danger" title={`Delete Flight ${flightToDelete?.flightNumber}?`} onConfirm={confirmDeleteFlight} onCancel={() => setIsDeleteModalOpen(false)} confirmText="Yes, Delete Flight" cancelText="Cancel">
        <div style={{ color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
          <p>Are you absolutely sure you want to delete flight <strong>{flightToDelete?.flightNumber}</strong>?</p>
          <p style={{ color: 'var(--color-danger-500)', marginTop: '1rem', fontSize: '0.9rem' }}>Warning: This action cannot be undone. It will permanently erase all associated seats and passenger bookings.</p>
        </div>
      </Modal>

      <CreateFlightModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onFlightCreated={() => fetchFlights(currentPage)} />
    </div>
  );
};

export default AdminFlightOpsPage;