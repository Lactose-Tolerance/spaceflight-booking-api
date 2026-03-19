import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/auth-page/AuthPage';
import FlightSearchPage from './pages/flight-search/FlightSearchPage';
import FlightSeatPage from './pages/flight-seat/FlightSeatPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/flights" element={<FlightSearchPage />} />
        <Route path="/flights/:flightId/seats" element={<FlightSeatPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;