package shino.api;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import shino.dtos.BoardingPassDTO;
import shino.dtos.BookingDTO;
import shino.dtos.DTOMapper;
import shino.entities.Booking;
import shino.entities.Seat;
import shino.services.BookingService;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping("/seat/{seatId}")
    public ResponseEntity<BookingDTO> bookASeat(
        @PathVariable Long seatId,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        Booking newBooking = bookingService.bookSeat(seatId, userDetails.getUsername());
        return ResponseEntity.ok(DTOMapper.toBookingDTO(newBooking));
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingDTO>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        List<Booking> myBookings = bookingService.getUserBookings(userDetails.getUsername());
        
        List<BookingDTO> response = myBookings.stream()
            .map(DTOMapper::toBookingDTO)
            .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{reference}/boarding-pass")
    public ResponseEntity<BoardingPassDTO> getBoardingPass(
        @PathVariable String reference,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean isAdmin = userDetails.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        Booking booking = bookingService.getBookingByReference(reference, userDetails.getUsername(), isAdmin);

        return ResponseEntity.ok(DTOMapper.toBoardingPassDTO(booking));
    }

    @DeleteMapping("/{reference}")
    public ResponseEntity<?> cancelBooking(
        @PathVariable String reference,
        @AuthenticationPrincipal UserDetails userDetails
    ) {
        boolean isAdmin = userDetails.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        Seat freedSeat = bookingService.cancelBooking(reference, userDetails.getUsername(), isAdmin);

        return ResponseEntity.ok(Map.of(
            "message", "Booking " + reference + " has been successfully canceled.",
            "freedSeat", freedSeat.getSeatNumber()
        ));
    }
}