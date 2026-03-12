package shino.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import shino.dtos.SeatDTO;
import shino.mappers.EntityMapper;
import shino.services.SeatService;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;
    private final EntityMapper mapper;

    public SeatController(SeatService seatService, EntityMapper mapper) {
        this.seatService = seatService;
        this.mapper = mapper;
    }

    @GetMapping("/flight/{flightId}")
    public List<SeatDTO> getAllSeatsForFlight(@PathVariable Long flightId) {
        return seatService.getAllSeatsForFlight(flightId).stream()
            .map(mapper::toSeatDTO)
            .toList();
    }

    @GetMapping("/flight/{flightId}/available")
    public List<SeatDTO> getAvailableSeatsForFlight(@PathVariable Long flightId) {
        return seatService.getAvailableSeatsForFlight(flightId).stream()
            .map(mapper::toSeatDTO)
            .toList();
    }

    @GetMapping("/{id}")
    public SeatDTO getSeatById(@PathVariable Long id) {
        return mapper.toSeatDTO(seatService.getSeatById(id));
    }
}