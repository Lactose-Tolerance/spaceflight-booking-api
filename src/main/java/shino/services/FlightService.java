package shino.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shino.dtos.FlightRequestDTO;
import shino.dtos.SeatConfigurationDTO;
import shino.dtos.UpdateFlightPricesDTO;
import shino.entities.Flight;
import shino.entities.Port;
import shino.entities.Seat;
import shino.exceptions.ResourceNotFoundException;
import shino.repositories.BookingRepository;
import shino.repositories.FlightRepository;
import shino.repositories.PortRepository;
import shino.repositories.SeatRepository;

@Service
public class FlightService {

    private final FlightRepository flightRepository;
    private final PortRepository portRepository;
    private final SeatRepository seatRepository;
    private final BookingRepository bookingRepository;

    public FlightService(FlightRepository flightRepository, PortRepository portRepository, SeatRepository seatRepository, BookingRepository bookingRepository) {
        this.flightRepository = flightRepository;
        this.portRepository = portRepository;
        this.seatRepository = seatRepository;
        this.bookingRepository = bookingRepository;
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

        if (request.arrival().isBefore(request.departure())) {
            throw new IllegalArgumentException("Arrival time must be after departure time.");
        }

        Flight newFlight = new Flight(
            request.flightNumber(), origin, destination, 
            request.departure(), request.arrival(), request.status(),
            request.firstClassPrice(), request.businessPrice(), request.economyPrice()
        );

        Flight savedFlight = flightRepository.save(newFlight);

        List<Seat> seatsToSave = new ArrayList<>();
        int currentRow = 1;

        for (SeatConfigurationDTO config : request.seatConfigurations()) {
            for (int r = 0; r < config.rows(); r++) {
                for (int c = 0; c < config.columns(); c++) {
                    char columnLetter = (char) ('A' + c);
                    String seatNumber = currentRow + String.valueOf(columnLetter);

                    Seat seat = new Seat();
                    seat.setSeatNumber(seatNumber);
                    seat.setClassType(config.type());
                    seat.setBooked(false);
                    seat.setFlight(savedFlight);

                    seatsToSave.add(seat);
                }
                currentRow++;
            }
        }

        seatRepository.saveAll(seatsToSave);

        return savedFlight;
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

        bookingRepository.deleteBySeatFlightId(id);
        
        seatRepository.deleteByFlightId(id); 
        
        flightRepository.deleteById(id);
    }

    @Transactional
    public Flight updateFlightPrices(Long id, UpdateFlightPricesDTO request) {
        Flight flight = flightRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Could not find flight with ID: " + id));
            
        flight.setFirstClassPrice(request.firstClassPrice());
        flight.setBusinessPrice(request.businessPrice());
        flight.setEconomyPrice(request.economyPrice());
        
        return flightRepository.save(flight);
    }
}