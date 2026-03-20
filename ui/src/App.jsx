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
import AdminLayout from './components/organisms/admin-layout/AdminLayout';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AdminFlightOpsPage from './pages/admin/flight-ops/AdminFlightOpsPage';
import AdminPortOpsPage from './pages/admin/port-ops/AdminPortOpsPage';

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

          <Route path="/admin" element={
            <AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} /> 
            <Route path="flights" element={<AdminFlightOpsPage />} />
            <Route path="ports" element={<AdminPortOpsPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;