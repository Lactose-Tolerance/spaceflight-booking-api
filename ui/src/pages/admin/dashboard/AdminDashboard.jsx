import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { flightService } from '../../../services/flightService';
import { portService } from '../../../services/portService';
import Button from '../../../components/atoms/button/Button';
import CreateFlightModal from '../../../components/organisms/create-flight/CreateFlightModal';
import CreatePortModal from '../../../components/organisms/create-port/CreatePortModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Metrics & Data State
  const [metrics, setMetrics] = useState({ totalPorts: 0, upcomingFlightsCount: 0 });
  const [upcomingDepartures, setUpcomingDepartures] = useState([]);

  // Quick Action Modal States
  const [isCreateFlightOpen, setIsCreateFlightOpen] = useState(false);
  const [isCreatePortOpen, setIsCreatePortOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get the current local time for the upcoming flights filter
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      const currentDateTime = now.toISOString().slice(0, 16);

      // 1. Fetch all ports to get the total count
      const portsData = await portService.getAllPorts();
      
      // 2. Fetch the next 5 upcoming flights (sorted chronologically)
      const flightsData = await flightService.searchFlights({
        page: 0,
        size: 5,
        sortBy: 'departure',
        sortDir: 'ASC',
        departure: currentDateTime // Only show future flights
      });

      setMetrics({
        totalPorts: portsData.length || 0,
        upcomingFlightsCount: flightsData.totalElements || flightsData.content?.length || 0
      });
      
      setUpcomingDepartures(flightsData.content || []);

    } catch (error) {
      console.error("Dashboard failed to load telemetry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-ops-page admin-dashboard">
      <div className="admin-header">
        <div>
          <h2 style={{ marginBottom: '0.25rem' }}>Astra Command Center</h2>
          <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '0.95rem' }}>
            System overview and global telemetry.
          </p>
        </div>
      </div>

      {isLoading ? (
        <p className="admin-table-msg">Initializing command systems...</p>
      ) : (
        <>
          {/* --- Top Metrics Row --- */}
          <div className="dashboard-metrics-grid">
            <div className="dash-metric-card">
              <span className="dash-metric-label">Operational Spaceports</span>
              <span className="dash-metric-value text-cyan">{metrics.totalPorts}</span>
            </div>
            <div className="dash-metric-card">
              <span className="dash-metric-label">Scheduled Future Flights</span>
              <span className="dash-metric-value text-purple">{metrics.upcomingFlightsCount}</span>
            </div>
            <div className="dash-metric-card">
              <span className="dash-metric-label">System Status</span>
              <span className="dash-metric-value text-green">NOMINAL</span>
            </div>
          </div>

          <div className="dashboard-content-grid">
            {/* --- Left Column: Departure Board --- */}
            <div className="dashboard-main-col">
              <div className="dash-section-header">
                <h3>Upcoming Departures</h3>
                <Button variant="ghost" onClick={() => navigate('/admin/flights')}>View All Flights →</Button>
              </div>
              
              <div className="admin-table-container">
                {upcomingDepartures.length === 0 ? (
                  <p className="admin-table-msg empty">No upcoming flights scheduled.</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Flight #</th>
                        <th>Route</th>
                        <th>Departure Time</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {upcomingDepartures.map(flight => (
                        <tr key={flight.id}>
                          <td><strong>{flight.flightNumber}</strong></td>
                          <td>{flight.origin?.code} → {flight.destination?.code}</td>
                          <td>{new Date(flight.departure).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</td>
                          <td>
                            <span className={`status-badge status-${flight.status.toLowerCase().replace(' ', '_')}`}>
                              {flight.status}
                            </span>
                          </td>
                          <td className="action-cells">
                            <Button variant="secondary" onClick={() => navigate(`/admin/flights/${flight.id}/manifest`)} className="sm-btn">
                              Manifest
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* --- Right Column: Quick Commands --- */}
            <div className="dashboard-side-col">
              <div className="dash-section-header">
                <h3>Quick Commands</h3>
              </div>
              
              <div className="quick-actions-grid">
                <div className="action-card" onClick={() => navigate('/admin/flights')}>
                  <h4>Manage Fleet</h4>
                  <p>View, edit, and cancel scheduled flights across the network.</p>
                </div>
                
                <div className="action-card" onClick={() => navigate('/admin/ports')}>
                  <h4>Spaceport Ops</h4>
                  <p>Manage planetary and orbital docking hubs.</p>
                </div>

                <div className="action-card action-primary" onClick={() => setIsCreateFlightOpen(true)}>
                  <h4>+ Schedule Flight</h4>
                  <p>Draft a new orbital route and open ticket sales.</p>
                </div>

                <div className="action-card action-primary" onClick={() => setIsCreatePortOpen(true)}>
                  <h4>+ Commission Port</h4>
                  <p>Establish a new operational spaceport destination.</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Hidden Modals triggered by Quick Actions */}
      <CreateFlightModal 
        isOpen={isCreateFlightOpen} 
        onClose={() => setIsCreateFlightOpen(false)} 
        onFlightCreated={fetchDashboardData} 
      />
      
      <CreatePortModal 
        isOpen={isCreatePortOpen} 
        onClose={() => setIsCreatePortOpen(false)} 
        onPortCreated={fetchDashboardData} 
      />
    </div>
  );
};

export default AdminDashboard;