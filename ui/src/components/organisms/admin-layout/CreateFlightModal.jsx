import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import FormField from '../../molecules/form-field/FormField';
import { portService } from '../../../services/portService';
import { flightService } from '../../../services/flightService';
import './CreateFlightModal.css';

const CreateFlightModal = ({ isOpen, onClose, onFlightCreated }) => {
  const [ports, setPorts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initial state for the complex flight payload
  const initialFormState = {
    flightNumber: '',
    originCode: '',
    destinationCode: '',
    departure: '',
    arrival: '',
    economyPrice: 0,
    businessPrice: 0,
    firstClassPrice: 0,
    economyRows: 6,
    economySeatsPerRow: 4,
    businessRows: 4,
    businessSeatsPerRow: 4,
    firstClassRows: 5,
    firstClassSeatsPerRow: 2
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      // Fetch ports when modal opens to populate the dropdowns
      portService.getAllPorts().then(setPorts).catch(console.error);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    // Basic validation so we don't send empty requests
    if (!formData.originCode || !formData.destinationCode || !formData.departure || !formData.arrival) {
      alert("Please fill out all ports and schedule times.");
      return;
    }

    setIsLoading(true);
    try {
      const formattedPayload = {
        flightNumber: formData.flightNumber,
        originCode: formData.originCode,
        destinationCode: formData.destinationCode,
        status: "SCHEDULED", // Required by FlightRequestDTO
        
        // Append ':00' for seconds if the browser omitted them
        departure: formData.departure.length === 16 ? `${formData.departure}:00` : formData.departure,
        arrival: formData.arrival.length === 16 ? `${formData.arrival}:00` : formData.arrival,
        
        // 1. PRICES ARE TOP-LEVEL PROPERTIES (Per FlightRequestDTO)
        economyPrice: parseFloat(formData.economyPrice),
        businessPrice: parseFloat(formData.businessPrice),
        firstClassPrice: parseFloat(formData.firstClassPrice),
        
        // 2. SEAT CONFIGURATIONS (Per FlightService.java mapping)
        seatConfigurations: [
          {
            type: "ECONOMY",
            rows: parseInt(formData.economyRows),
            columns: parseInt(formData.economySeatsPerRow)
          },
          {
            type: "BUSINESS",
            rows: parseInt(formData.businessRows),
            columns: parseInt(formData.businessSeatsPerRow)
          },
          {
            type: "FIRST_CLASS",
            rows: parseInt(formData.firstClassRows),
            columns: parseInt(formData.firstClassSeatsPerRow)
          }
        ]
      };

      await flightService.createFlight(formattedPayload);
      setFormData(initialFormState); // Reset form
      onFlightCreated(); // Refresh the table
      onClose(); // Close modal
    } catch (error) {
      console.error("Flight Creation Error Payload:", error.response?.data);
      const errorMsg = error.response?.data?.validationErrors 
        ? JSON.stringify(error.response.data.validationErrors) 
        : "Invalid Data Submitted";
      alert("Failed to create flight: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      title="Dispatch New Orbital Flight" 
      onConfirm={handleSubmit} 
      onCancel={onClose}
      confirmText={isLoading ? "Dispatching..." : "Create Flight"}
    >
      <div className="create-flight-grid">
        
        {/* ROW 1: Flight Details */}
        <FormField id="flightNumber" label="Flight Number (e.g. AST-101)" type="text" value={formData.flightNumber} onChange={handleChange} />
        
        <div className="form-field-molecule">
          <label htmlFor="originCode">Origin Port</label>
          <select id="originCode" className="form-input" value={formData.originCode} onChange={handleChange}>
            <option value="">Select Origin...</option>
            {ports.map((port, index) => <option key={port.id || index} value={port.code}>{port.name} ({port.code})</option>)}
          </select>
        </div>

        <div className="form-field-molecule">
          <label htmlFor="destinationCode">Destination Port</label>
          <select id="destinationCode" className="form-input" value={formData.destinationCode} onChange={handleChange}>
            <option value="">Select Destination...</option>
            {ports.map((port, index) => <option key={port.id || index} value={port.code}>{port.name} ({port.code})</option>)}
          </select>
        </div>

        {/* ROW 2: Schedule */}
        <FormField id="departure" label="Departure Time" type="datetime-local" value={formData.departure} onChange={handleChange} />
        <FormField id="arrival" label="Arrival Time" type="datetime-local" value={formData.arrival} onChange={handleChange} />
        
        {/* ROW 3: Prices */}
        <h4 className="grid-section-title">Ticket Pricing ($)</h4>
        <FormField id="economyPrice" label="Economy Base Price" type="number" min="0" value={formData.economyPrice} onChange={handleChange} />
        <FormField id="businessPrice" label="Business Base Price" type="number" min="0" value={formData.businessPrice} onChange={handleChange} />
        <FormField id="firstClassPrice" label="First Class Base Price" type="number" min="0" value={formData.firstClassPrice} onChange={handleChange} />

        {/* ROW 4: Seat Configuration */}
        <h4 className="grid-section-title">Seat Configuration (Rows / Seats Per Row)</h4>
        <div className="seat-config-group">
           <FormField id="economyRows" label="Econ Rows" type="number" min="0" value={formData.economyRows} onChange={handleChange} />
           <FormField id="economySeatsPerRow" label="Econ Cols" type="number" min="0" value={formData.economySeatsPerRow} onChange={handleChange} />
        </div>
        <div className="seat-config-group">
           <FormField id="businessRows" label="Bus. Rows" type="number" min="0" value={formData.businessRows} onChange={handleChange} />
           <FormField id="businessSeatsPerRow" label="Bus. Cols" type="number" min="0" value={formData.businessSeatsPerRow} onChange={handleChange} />
        </div>
        <div className="seat-config-group">
           <FormField id="firstClassRows" label="1st Class Rows" type="number" min="0" value={formData.firstClassRows} onChange={handleChange} />
           <FormField id="firstClassSeatsPerRow" label="1st Cols" type="number" min="0" value={formData.firstClassSeatsPerRow} onChange={handleChange} />
        </div>

      </div>
    </Modal>
  );
};

export default CreateFlightModal;