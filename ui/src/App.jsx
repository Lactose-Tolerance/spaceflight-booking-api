import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/landing/LandingPage';
import AuthPage from './pages/auth-page/AuthPage'; // Using your single AuthPage
import FlightSearchPage from './pages/flight-search/FlightSearchPage';
import FlightSeatPage from './pages/flight-seat/FlightSeatPage';
import SeatBookingPage from './pages/seat-booking/SeatBookingPage';
import MyBookingsPage from './pages/my-bookings/MyBookingsPage';
import BoardingPassPage from './pages/boarding-pass/BoardingPassPage';
import Navbar from './components/organisms/navbar/Navbar';
import ProtectedRoute from './utils/ProtectedRoute'; // Import the guard

import './styles/global.css';

function App() {
  return (
    <BrowserRouter>
      <Navbar /> 
      
      <div className="app-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Publicly viewable exploration routes */}
          <Route path="/flights" element={<FlightSearchPage />} />
          <Route path="/flights/:flightId/seats" element={<FlightSeatPage />} />
          
          {/* PROTECTED ROUTES: Require Login */}
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
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;