import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Button from '../../atoms/button/Button';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is logged in[cite: 16]
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token;

  // Safely decode the JWT to check for Admin role
  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.roles && payload.roles.includes('ROLE_ADMIN');
    } catch (e) {
      console.error("Failed to parse token for roles");
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token'); //[cite: 16]
    navigate('/'); //[cite: 16]
  };

  // Don't show the navbar on the login or register pages[cite: 16]
  if (location.pathname === '/auth') {
    return null; //[cite: 16]
  }

  return (
    <nav className="navbar-organism">
      <div className="navbar-container">
        
        {/* Brand / Logo Area */}
        <div className="navbar-brand">
          <Link to={isAdmin ? "/admin" : "/"} className="brand-link">
            <span className="brand-icon">✧</span>
            <span className="brand-text">
              Astra<span className="brand-highlight">{isAdmin ? 'Command' : 'Lines'}</span>
            </span>
          </Link>
        </div>

        {/* Center Navigation Links (Only show if logged in) */}
        {isAuthenticated && (
          <div className="navbar-links">
            {isAdmin ? (
              // --- Admin Links ---
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`nav-link ${location.pathname.includes('/admin/dashboard') ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/flights" 
                  className={`nav-link ${location.pathname.includes('/admin/flights') ? 'active' : ''}`}
                >
                  Manage Flights
                </Link>
                <Link 
                  to="/admin/ports" 
                  className={`nav-link ${location.pathname.includes('/admin/ports') ? 'active' : ''}`}
                >
                  Manage Ports
                </Link>
              </>
            ) : (
              // --- Civilian Links ---
              <>
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
              </>
            )}
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