import React, { useState, useEffect } from 'react';
import { portService } from '../../../services/portService';
import Button from '../../../components/atoms/button/Button';
import FormField from '../../../components/molecules/form-field/FormField'; // <-- Import FormField!
import Modal from '../../../components/organisms/modal/Modal';
import CreatePortModal from '../../../components/organisms/create-port/CreatePortModal';
import './AdminPortOpsPage.css';

const AdminPortOpsPage = () => {
  const [ports, setPorts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // --- Search State ---
  const [searchCode, setSearchCode] = useState('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [portToDelete, setPortToDelete] = useState(null);

  const fetchPorts = async () => {
    setIsLoading(true);
    try {
      const data = await portService.getAllPorts();
      setPorts(data || []);
    } catch (error) {
      console.error("Failed to fetch ports", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPorts();
  }, []);

  const openDeleteModal = (port) => {
    setPortToDelete(port);
    setIsDeleteModalOpen(true);
  };

  const confirmDeletePort = async () => {
    try {
      await portService.deletePort(portToDelete.code);
      setIsDeleteModalOpen(false);
      fetchPorts(); 
    } catch (error) {
      alert("Failed to delete port: " + (error.response?.data?.message || ""));
    }
  };

  // --- Real-time Filter Logic ---
  const displayedPorts = ports.filter(port => 
    port.code.toLowerCase().includes(searchCode.toLowerCase())
  );

  return (
    <div className="admin-ops-page">
      <div className="admin-header">
        <h2>Spaceport Operations</h2>
        <Button variant="primary" onClick={() => setIsCreateModalOpen(true)}>Commission Spaceport</Button>
      </div>

      {/* --- Search Bar --- */}
      <div className="port-search-bar">
        <FormField 
          id="searchCode" 
          label="Search by Port Code" 
          placeholder="e.g. KSC" 
          value={searchCode} 
          onChange={(e) => setSearchCode(e.target.value)} 
        />
      </div>

      <div className="admin-table-container">
        {isLoading ? (
          <p className="admin-table-msg">Scanning sector for operational ports...</p>
        ) : displayedPorts.length === 0 ? (
          <p className="admin-table-msg empty">
            {ports.length === 0 ? "No spaceports found." : `No spaceports match code "${searchCode}".`}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Name</th>
                <th>Planet / Country</th>
                <th>Type</th>
                <th>Coordinates / Orbit</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Map over displayedPorts instead of ports */}
              {displayedPorts.map(port => (
                <tr key={port.code}>
                  <td><strong>{port.code}</strong></td>
                  <td>{port.name}</td>
                  <td>{port.planet} {port.country ? `(${port.country})` : ''}</td>
                  <td>
                    <span className={`status-badge status-${port.type.toLowerCase()}`}>
                      {port.type}
                    </span>
                  </td>
                  <td className="coords-cell">
                    {port.type === 'PLANETARY' 
                      ? `Lat: ${port.latitude || 'N/A'}, Lon: ${port.longitude || 'N/A'}`
                      : `SMA: ${port.semiMajorAxis || 'N/A'}, Inc: ${port.inclination || 'N/A'}`
                    }
                  </td>
                  <td className="action-cells">
                    <Button variant="secondary" onClick={() => openDeleteModal(port)} className="sm-btn delete-btn">Decommission</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal 
        isOpen={isDeleteModalOpen} 
        variant="danger" 
        title={`Decommission ${portToDelete?.name}?`} 
        onConfirm={confirmDeletePort} 
        onCancel={() => setIsDeleteModalOpen(false)} 
        confirmText="Yes, Decommission" 
        cancelText="Cancel"
      >
        <div className="danger-modal-text">
          <p>Are you absolutely sure you want to permanently delete <strong>{portToDelete?.name} ({portToDelete?.code})</strong>?</p>
          <p className="danger-modal-warning">
            Warning: This action cannot be undone. You cannot delete a spaceport if there are active flights departing or arriving from it.
          </p>
        </div>
      </Modal>

      <CreatePortModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onPortCreated={() => fetchPorts()} 
      />
    </div>
  );
};

export default AdminPortOpsPage;