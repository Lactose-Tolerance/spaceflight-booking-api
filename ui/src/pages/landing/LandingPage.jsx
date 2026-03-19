import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/atoms/button/Button';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="hero-section">
        <h1 className="hero-title">
          Your Journey to the <span className="text-cyan">Stars</span> Begins Here.
        </h1>
        <p className="hero-subtitle">
          Experience premium interplanetary travel with AstraLines. From your home to the alien worlds, we guarantee a safe and luxurious voyage.
        </p>
        <div className="hero-actions">
          <Button variant="primary" onClick={() => navigate('/flights')} className="hero-btn">
            Explore Flights
          </Button>
          {!localStorage.getItem('token') && (
            <Button variant="ghost" onClick={() => navigate('/auth')} className="hero-btn">
              Create an Account
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;