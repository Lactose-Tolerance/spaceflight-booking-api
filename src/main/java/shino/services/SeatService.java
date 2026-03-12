package shino.services;

import java.util.List;

import org.springframework.stereotype.Service;

import shino.entities.Seat;
import shino.exceptions.ResourceNotFoundException;
import shino.repositories.SeatRepository;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public List<Seat> getAllSeatsForFlight(Long flightId) {
        return seatRepository.findByFlightId(flightId);
    }

    public List<Seat> getAvailableSeatsForFlight(Long flightId) {
        return seatRepository.findByFlightIdAndBookedFalse(flightId);
    }

    public Seat getSeatById(Long id) {
        return seatRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + id));
    }
}