package shino.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import shino.entities.Booking;
import shino.entities.User;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser(User user);
    Optional<Booking> findByBookingReference(String bookingReference);
    List<Booking> findBySeatFlightId(Long flightId);
    void deleteBySeatFlightId(Long flightId);
}