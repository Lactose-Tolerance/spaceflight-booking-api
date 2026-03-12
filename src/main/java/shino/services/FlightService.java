package shino.services;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shino.dtos.FlightRequestDTO;
import shino.entities.Flight;
import shino.entities.Port;
import shino.exceptions.ResourceNotFoundException;
import shino.repositories.FlightRepository;
import shino.repositories.PortRepository;
import shino.repositories.SeatRepository;

@Service
public class FlightService {

    private final FlightRepository flightRepository;
    private final PortRepository portRepository;
    private final SeatRepository seatRepository;

    public FlightService(FlightRepository flightRepository, PortRepository portRepository, SeatRepository seatRepository) {
        this.flightRepository = flightRepository;
        this.portRepository = portRepository;
        this.seatRepository = seatRepository;
    }

    public Page<Flight> searchFlights(
        String origin, String destination,
        String originPlanet, String destinationPlanet, 
        java.time.LocalDateTime departure, java.time.LocalDateTime arrival,
        Pageable pageable) {
        
        return flightRepository.searchFlightsWithPagination(
                origin, destination, originPlanet, destinationPlanet, departure, arrival, pageable
        );
    }

    @Transactional
    public Flight addFlight(FlightRequestDTO request) {
        Port origin = portRepository.findById(request.originCode())
            .orElseThrow(() -> new ResourceNotFoundException("Origin port not found with code: " + request.originCode()));
                
        Port destination = portRepository.findById(request.destinationCode())
            .orElseThrow(() -> new ResourceNotFoundException("Destination port not found with code: " + request.destinationCode()));

        Flight newFlight = new Flight(
            request.flightNumber(), origin, destination, 
            request.departure(), request.arrival(), request.status()
        );

        return flightRepository.save(newFlight);
    }

    public Flight getFlightById(Long id) {
        return flightRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Could not find flight with ID: " + id));
    }

    public Flight getFlightByNumber(String flightNumber) {
        return flightRepository.findByFlightNumber(flightNumber);
    }

    @Transactional
    public void deleteFlight(Long id) {
        if (!flightRepository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete. Flight " + id + " does not exist.");
        }
        
        seatRepository.deleteByFlightId(id); 
        
        flightRepository.deleteById(id);
    }
}