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
import shino.entities.User;
import shino.repositories.BookingRepository;
import shino.repositories.SeatRepository;
import shino.repositories.UserRepository;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public BookingController(BookingRepository bookingRepository, SeatRepository seatRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/seat/{seatId}")
    public ResponseEntity<BookingDTO> bookASeat(
        @PathVariable Long seatId,
        @AuthenticationPrincipal UserDetails userDetails 
    ) {
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Seat seat = seatRepository.findById(seatId)
            .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (seat.isBooked()) {
            throw new RuntimeException("Seat is already booked!");
        }

        seat.setBooked(true);
        seatRepository.save(seat);

        Booking newBooking = new Booking(currentUser, seat);
        bookingRepository.save(newBooking);

        return ResponseEntity.ok(DTOMapper.toBookingDTO(newBooking));
    }

    @GetMapping("/{reference}/boarding-pass")
    public ResponseEntity<BoardingPassDTO> getBoardingPass(
            @PathVariable String reference,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Booking booking = bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isOwner = booking.getUser().getUsername().equals(userDetails.getUsername());
        boolean isAdmin = userDetails.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: You do not have permission to view this boarding pass.");
        }

        return ResponseEntity.ok(DTOMapper.toBoardingPassDTO(booking));
    }

    @DeleteMapping("/{reference}")
    public ResponseEntity<?> cancelBooking(
            @PathVariable String reference,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Booking booking = bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        boolean isOwner = booking.getUser().getUsername().equals(userDetails.getUsername());
        boolean isAdmin = userDetails.getAuthorities().stream()
            .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!isOwner && !isAdmin) {
            throw new RuntimeException("Access Denied: You cannot cancel someone else's booking.");
        }

        Seat seat = booking.getSeat();
        seat.setBooked(false);
        seatRepository.save(seat);

        bookingRepository.delete(booking);

        return ResponseEntity.ok(Map.of(
            "message", "Booking " + reference + " has been successfully canceled.",
            "freedSeat", seat.getSeatNumber()
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<List<BookingDTO>> getMyBookings(@AuthenticationPrincipal UserDetails userDetails) {
        User currentUser = userRepository.findByUsername(userDetails.getUsername())
            .orElseThrow(() -> new RuntimeException("User not found"));

        List<Booking> myBookings = bookingRepository.findByUser(currentUser);
        
        List<BookingDTO> response = myBookings.stream()
            .map(DTOMapper::toBookingDTO)
            .toList();

        return ResponseEntity.ok(response);
    }
}