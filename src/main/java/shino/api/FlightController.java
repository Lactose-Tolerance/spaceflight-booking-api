package shino.api;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import shino.dtos.FlightDTO;
import shino.dtos.FlightRequestDTO;
import shino.dtos.UpdateFlightPricesDTO;
import shino.dtos.UpdateFlightStatusDTO;
import shino.entities.Flight;
import shino.mappers.EntityMapper;
import shino.services.FlightService;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService flightService;
    private final EntityMapper mapper;

    public FlightController(FlightService flightService, EntityMapper mapper) {
        this.flightService = flightService;
        this.mapper = mapper;
    }

    @GetMapping
    public Page<FlightDTO> searchFlights(
            @RequestParam(required = false) String flightNumber,
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) String originPlanet,
            @RequestParam(required = false) String destinationPlanet,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime departure,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime arrival,
            @RequestParam(required = false) java.util.List<shino.entities.FlightStatus> status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "departure") String sortBy,
            @RequestParam(defaultValue = "ASC") String sortDir
    ) {
        // Construct the Sort object dynamically based on direction
        Sort sort = sortDir.equalsIgnoreCase(Sort.Direction.ASC.name()) 
                    ? Sort.by(sortBy).ascending() 
                    : Sort.by(sortBy).descending();

        Page<Flight> flightPage = flightService.searchFlights(
            flightNumber, origin, destination, originPlanet, destinationPlanet, 
            departure, arrival, status, PageRequest.of(page, size, sort)
        );
        return flightPage.map(mapper::toFlightDTO);
    }

    @PostMapping
    public ResponseEntity<FlightDTO> addFlight(@Valid @RequestBody FlightRequestDTO request) {
        return ResponseEntity.ok(mapper.toFlightDTO(flightService.addFlight(request)));
    }

    @GetMapping("/{id}")
    public FlightDTO getFlightById(@PathVariable Long id) {
        return mapper.toFlightDTO(flightService.getFlightById(id));
    }

    @GetMapping("/number/{flightNumber}")
    public FlightDTO getFlightByNumber(@PathVariable String flightNumber) {
        return mapper.toFlightDTO(flightService.getFlightByNumber(flightNumber));
    }

    @DeleteMapping("/{id}")
    public String deleteFlight(@PathVariable Long id) {
        flightService.deleteFlight(id);
        return "Flight " + id + " has been successfully deleted.";
    }

    @PatchMapping("/{id}/prices")
    public ResponseEntity<FlightDTO> updateFlightPrices(@PathVariable Long id, @Valid @RequestBody UpdateFlightPricesDTO request) {
        return ResponseEntity.ok(mapper.toFlightDTO(flightService.updateFlightPrices(id, request)));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<FlightDTO> updateFlightStatus(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateFlightStatusDTO request) {
        return ResponseEntity.ok(mapper.toFlightDTO(flightService.updateFlightStatus(id, request.status())));
    }
}