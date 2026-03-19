import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="admin-layout-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <h2>Astra<span className="text-cyan">Command</span></h2>
          <span className="admin-badge">Admin Privileges Active</span>
        </div>
        
        <nav className="admin-nav">
          <Link 
            to="/admin" 
            className={`admin-nav-link ${location.pathname === '/admin' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/admin/flights" 
            className={`admin-nav-link ${location.pathname.includes('/admin/flights') ? 'active' : ''}`}
          >
            Flight Operations
          </Link>
          <Link 
            to="/admin/bookings" 
            className={`admin-nav-link ${location.pathname.includes('/admin/bookings') ? 'active' : ''}`}
          >
            Passenger Manifests
          </Link>
          <Link 
            to="/admin/ports" 
            className={`admin-nav-link ${location.pathname.includes('/admin/ports') ? 'active' : ''}`}
          >
            Spaceports
          </Link>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="admin-main-content">
        {/* <Outlet /> acts as a placeholder for the nested child routes we define in App.jsx */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;