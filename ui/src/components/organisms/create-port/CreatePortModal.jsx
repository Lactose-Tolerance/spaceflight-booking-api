import React, { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import FormField from '../../molecules/form-field/FormField';
import { portService, planetService } from '../../../services/portService';
import './CreatePortModal.css';

const CreatePortModal = ({ isOpen, onClose, onPortCreated }) => {
  const [planets, setPlanets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const initialFormState = {
    code: '', name: '', country: '', planetName: '', type: 'PLANETARY',
    latitude: '', longitude: '', semiMajorAxis: '', semiMinorAxis: '', inclination: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (isOpen) {
      planetService.getAllPlanets().then(setPlanets).catch(console.error);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.name || !formData.planetName) {
      alert("Please fill out all required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const formattedPayload = {
        code: formData.code.toUpperCase(),
        name: formData.name,
        country: formData.country,
        planetName: formData.planetName,
        type: formData.type,
        latitude: formData.type === 'PLANETARY' && formData.latitude !== '' ? parseFloat(formData.latitude) : null,
        longitude: formData.type === 'PLANETARY' && formData.longitude !== '' ? parseFloat(formData.longitude) : null,
        semiMajorAxis: formData.type === 'ORBITAL' && formData.semiMajorAxis !== '' ? parseFloat(formData.semiMajorAxis) : null,
        semiMinorAxis: formData.type === 'ORBITAL' && formData.semiMinorAxis !== '' ? parseFloat(formData.semiMinorAxis) : null,
        inclination: formData.type === 'ORBITAL' && formData.inclination !== '' ? parseFloat(formData.inclination) : null
      };

      await portService.createPort(formattedPayload);
      setFormData(initialFormState);
      onPortCreated();
      onClose();
    } catch (error) {
      console.error("Port Creation Error:", error.response?.data);
      const errorMsg = error.response?.data?.validationErrors 
        ? JSON.stringify(error.response.data.validationErrors) 
        : error.response?.data?.message || "Invalid Data Submitted";
      alert("Failed to create spaceport: " + errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      title="Commission New Spaceport" 
      onConfirm={handleSubmit} 
      onCancel={onClose}
      confirmText={isLoading ? "Building..." : "Create Spaceport"}
    >
      <div className="create-port-grid">
        
        <h4 className="port-section-title">General Info</h4>
        
        <div className="port-row-1-2">
          <FormField id="code" label="Port Code" value={formData.code} onChange={handleChange} />
          <FormField id="name" label="Port Name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="port-row-halves">
          <div className="form-field-molecule">
            <label htmlFor="planetName">Planet</label>
            <select id="planetName" className="form-input" value={formData.planetName} onChange={handleChange}>
              <option value="">Select Planet...</option>
              {planets.map((planet) => <option key={planet.id} value={planet.name}>{planet.name}</option>)}
            </select>
          </div>
          <FormField id="country" label="Country / Region" value={formData.country} onChange={handleChange} />
        </div>

        <h4 className="port-section-title mt-1">Location Metrics</h4>

        <div className="form-field-molecule">
          <label htmlFor="type">Port Type</label>
          <select id="type" className="form-input" value={formData.type} onChange={handleChange}>
            <option value="PLANETARY">Planetary Surface</option>
            <option value="ORBITAL">Orbital Station</option>
          </select>
        </div>

        {formData.type === 'PLANETARY' && (
          <div className="port-row-halves">
            <FormField id="latitude" label="Latitude" type="number" value={formData.latitude} onChange={handleChange} />
            <FormField id="longitude" label="Longitude" type="number" value={formData.longitude} onChange={handleChange} />
          </div>
        )}

        {formData.type === 'ORBITAL' && (
          <div className="port-row-thirds">
            <FormField id="semiMajorAxis" label="Semi-Major Axis" type="number" value={formData.semiMajorAxis} onChange={handleChange} />
            <FormField id="semiMinorAxis" label="Semi-Minor Axis" type="number" value={formData.semiMinorAxis} onChange={handleChange} />
            <FormField id="inclination" label="Inclination" type="number" value={formData.inclination} onChange={handleChange} />
          </div>
        )}

      </div>
    </Modal>
  );
};

export default CreatePortModal;