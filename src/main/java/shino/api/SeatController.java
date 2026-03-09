package shino.api;

import org.springframework.web.bind.annotation.*;
import shino.dtos.DTOMapper;
import shino.dtos.SeatDTO;
import shino.entities.Seat;
import shino.repositories.SeatRepository;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatRepository seatRepository;

    public SeatController(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    @GetMapping("/flight/{flightId}")
    public List<SeatDTO> getAllSeatsForFlight(@PathVariable Long flightId) {
        return seatRepository.findByFlightId(flightId).stream()
            .map(DTOMapper::toSeatDTO)
            .toList();
    }

    @GetMapping("/flight/{flightId}/available")
    public List<SeatDTO> getAvailableSeatsForFlight(@PathVariable Long flightId) {
        return seatRepository.findByFlightIdAndBookedFalse(flightId).stream()
            .map(DTOMapper::toSeatDTO)
            .toList();
    }

    @GetMapping("/{id}")
    public SeatDTO getSeatById(@PathVariable Long id) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found with ID: " + id));
        return DTOMapper.toSeatDTO(seat);
    }

    @PostMapping("/{id}/book")
    public SeatDTO bookSeat(@PathVariable Long id) {
        Seat seatToBook = seatRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Seat not found with ID: " + id));

        if (seatToBook.isBooked()) {
            throw new RuntimeException("Seat " + seatToBook.getSeatNumber() + " is already booked!");
        }

        seatToBook.setBooked(true);
        Seat savedSeat = seatRepository.save(seatToBook);

        return DTOMapper.toSeatDTO(savedSeat);
    }
}