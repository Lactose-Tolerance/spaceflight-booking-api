package shino.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import shino.dtos.DTOMapper;
import shino.dtos.FlightDTO;
import shino.dtos.FlightRequestDTO;
import shino.entities.Flight;
import shino.entities.Port;
import shino.repositories.FlightRepository;
import shino.repositories.PortRepository;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightRepository flightRepository;
    private final PortRepository portRepository;

    public FlightController(FlightRepository flightRepository, PortRepository portRepository) {
        this.flightRepository = flightRepository;
        this.portRepository = portRepository;
    }

    @GetMapping
    public Page<FlightDTO> searchFlights(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String originPlanet,
            @RequestParam(required = false) String destinationPlanet,
            @RequestParam(required = false) String departure,
            @RequestParam(required = false) String arrival,

            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "departure") String sortBy
    ) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        Page<Flight> flightPage = flightRepository.searchFlightsWithPagination(
                origin, destination, originPlanet, destinationPlanet, pageable
        );

        return flightPage.map(flight -> DTOMapper.toFlightDTO(flight));
    }

    @PostMapping
    public ResponseEntity<FlightDTO> addFlight(@Valid @RequestBody FlightRequestDTO request) {
        
        Port origin = portRepository.findById(request.originCode())
            .orElseThrow(() -> new RuntimeException("Origin port not found with code: " + request.originCode()));
                
        Port destination = portRepository.findById(request.destinationCode())
            .orElseThrow(() -> new RuntimeException("Destination port not found with code: " + request.destinationCode()));

        Flight newFlight = new Flight(
            request.flightNumber(),
            origin,
            destination,
            request.departure(),
            request.arrival(),
            request.status()
        );

        flightRepository.save(newFlight);

        return ResponseEntity.ok(DTOMapper.toFlightDTO(newFlight));
    }

    @GetMapping("/{id}")
    public FlightDTO getFlightById(@PathVariable Long id) {
        return flightRepository.findById(id)
            .map(DTOMapper::toFlightDTO)
            .orElseThrow(() -> new RuntimeException("Could not find flight with ID: " + id));
    }

    @GetMapping("/number/{flightNumber}")
    public FlightDTO getFlightByNumber(@PathVariable String flightNumber) {
        return DTOMapper.toFlightDTO(
            flightRepository.findByFlightNumber(flightNumber)
        );
    }

    @DeleteMapping("/{id}")
    public String deleteFlight(@PathVariable Long id) {
        if (!flightRepository.existsById(id)) {
            throw new RuntimeException("Cannot delete. Flight " + id + " does not exist.");
        }
        flightRepository.deleteById(id);
        return "Flight " + id + " has been successfully deleted.";
    }
}