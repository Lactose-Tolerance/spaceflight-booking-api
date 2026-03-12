package shino.api;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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
import shino.dtos.FlightDTO;
import shino.dtos.FlightRequestDTO;
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
        Page<Flight> flightPage = flightService.searchFlights(
            origin, destination, originPlanet, destinationPlanet, PageRequest.of(page, size, Sort.by(sortBy))
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
}