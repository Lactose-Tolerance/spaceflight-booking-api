import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import AuthPage from './pages/auth-page/AuthPage';
import FlightSearchPage from './pages/flight-search/FlightSearchPage';
import FlightSeatPage from './pages/flight-seat/FlightSeatPage';
import SeatBookingPage from './pages/seat-booking/SeatBookingPage';
import MyBookingsPage from './pages/my-bookings/MyBookingsPage';
import BoardingPassPage from './pages/boarding-pass/BoardingPassPage';
import Navbar from './components/organisms/navbar/Navbar';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminRoute from './utils/AdminRoute';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AdminFlightOpsPage from './pages/admin/flight-ops/AdminFlightOpsPage';
import AdminPortOpsPage from './pages/admin/port-ops/AdminPortOpsPage';
import AdminManifestPage from './pages/admin/manifest/AdminManifestPage';
import AdminLandingPage from './pages/admin/landing/AdminLandingPage';
import TripPlanningPage from './pages/trip-planning/TripPlanningPage';
import TripSeatBookingPage from './pages/trip-seat-booking/TripSeatBookingPage';
import TripCheckoutPage from './pages/trip-checkout/TripCheckoutPage';

import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      
      <div className="app-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          <Route path="/flights" element={<FlightSearchPage />} />
          <Route path="/flights/:flightId/seats" element={<FlightSeatPage />} />
          
          <Route path="/flights/:flightId/seats/:seatId/book" element={
            <ProtectedRoute>
              <SeatBookingPage />
            </ProtectedRoute>
          } />
          
          <Route path="/my-bookings" element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          } />
          
          <Route path="/boarding-pass/:reference" element={
            <ProtectedRoute>
              <BoardingPassPage />
            </ProtectedRoute>
          } />

          <Route path="/plan" element={<TripPlanningPage />} />
          <Route path="/book-trip" element={<TripSeatBookingPage />} />
          <Route path="/trip-checkout" element={<ProtectedRoute><TripCheckoutPage /></ProtectedRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminLandingPage /></AdminRoute>} />
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/flights" element={<AdminRoute><AdminFlightOpsPage /></AdminRoute>} />
          <Route path="/admin/ports" element={<AdminRoute><AdminPortOpsPage /></AdminRoute>} />
          <Route path="/admin/flights/:flightId/manifest" element={<AdminRoute><AdminManifestPage /></AdminRoute>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;