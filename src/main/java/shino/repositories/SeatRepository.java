package shino.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import shino.entities.Seat;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByFlightId(Long flightId);
    List<Seat> findByFlightIdAndBookedFalse(Long flightId);
    List<Seat> findByFlightFlightNumber(String flightNumber);
    void deleteByFlightId(Long flightId);
}