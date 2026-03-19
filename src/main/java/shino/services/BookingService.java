package shino.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shino.entities.Booking;
import shino.entities.FlightStatus;
import shino.entities.Seat;
import shino.entities.User;
import shino.exceptions.ResourceNotFoundException;
import shino.exceptions.SeatAlreadyBookedException;
import shino.exceptions.UnauthorizedActionException;
import shino.repositories.BookingRepository;
import shino.repositories.SeatRepository;
import shino.repositories.UserRepository;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository, SeatRepository seatRepository, UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.seatRepository = seatRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Booking bookSeat(Long seatId, String username) {
    
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Seat seat = seatRepository.findById(seatId)
            .orElseThrow(() -> new ResourceNotFoundException("Seat not found with ID: " + seatId));
        
        if (seat.getFlight().getStatus() != FlightStatus.SCHEDULED) {
            throw new IllegalStateException("Seat booking is closed. This flight is currently " + seat.getFlight().getStatus() + ".");
        }

        if (seat.isBooked()) {
            throw new SeatAlreadyBookedException("Seat " + seat.getSeatNumber() + " is already booked!");
        }

        seat.setBooked(true);
        seatRepository.save(seat);

        Booking newBooking = new Booking(currentUser, seat);
        return bookingRepository.save(newBooking);
    }

    public List<Booking> getUserBookings(String username) {
        User currentUser = userRepository.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return bookingRepository.findByUser(currentUser);
    }

    public Booking getBookingByReference(String reference, String username, boolean isAdmin) {
        Booking booking = bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));

        boolean isOwner = booking.getUser().getUsername().equals(username);
        
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("Access Denied: You do not have permission to view this boarding pass.");
        }

        return booking;
    }

    @Transactional
    public Seat cancelBooking(String reference, String username, boolean isAdmin) {
        Booking booking = bookingRepository.findByBookingReference(reference)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));

        boolean isOwner = booking.getUser().getUsername().equals(username);
        
        if (!isOwner && !isAdmin) {
            throw new UnauthorizedActionException("Access Denied: You cannot cancel someone else's booking.");
        }

        Seat seat = booking.getSeat();
        seat.setBooked(false);
        seatRepository.save(seat);

        bookingRepository.delete(booking);

        return seat;
    }
}