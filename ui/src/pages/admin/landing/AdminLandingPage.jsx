import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/atoms/button/Button';
import '../../../pages/landing/LandingPage.css'; // Reusing your beautiful hero CSS!

const AdminLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">
          Welcome to <span className="text-cyan">AstraCommand</span>.
        </h1>
        <p className="hero-subtitle">
          Centralized orbital operations and fleet management. Monitor network telemetry, schedule interplanetary routes, and manage spaceport hubs globally.
        </p>
        <div className="hero-actions">
          <Button variant="primary" onClick={() => navigate('/admin/dashboard')} className="hero-btn">
            View Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLandingPage;