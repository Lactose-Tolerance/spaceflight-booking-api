import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../atoms/button/Button';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is logged in by looking for the JWT token
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  // Don't show the navbar on the login or register pages to keep them clean
  if (location.pathname === '/auth') {
    return null;
  }

  return (
    <nav className="navbar-organism">
      <div className="navbar-container">
        {/* Brand / Logo Area */}
        <div className="navbar-brand">
          <Link to="/" className="brand-link">
            <span className="brand-icon">✧</span>
            <span className="brand-text">Astra<span className="brand-highlight">Lines</span></span>
          </Link>
        </div>

        {/* Center Navigation Links (Only show if logged in) */}
        {isAuthenticated && (
          <div className="navbar-links">
            <Link 
              to="/flights" 
              className={`nav-link ${location.pathname.includes('/flights') ? 'active' : ''}`}
            >
              Search Flights
            </Link>
            <Link 
              to="/my-bookings" 
              className={`nav-link ${location.pathname.includes('/my-bookings') ? 'active' : ''}`}
            >
              My Bookings
            </Link>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <Button variant="ghost" onClick={handleLogout} className="logout-btn">
              Sign Out
            </Button>
          ) : (
            <div className="auth-links">
              <Button variant="primary" onClick={() => navigate('/auth')}>
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;