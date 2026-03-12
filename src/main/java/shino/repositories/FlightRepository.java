package shino.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import shino.entities.Flight;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Long> {
    
    Flight findByFlightNumber(String flightNumber);

    @Query("SELECT f FROM Flight f WHERE " +
           "(:origin IS NULL OR LOWER(f.origin.code) LIKE LOWER(CONCAT('%', :origin, '%')) OR LOWER(f.origin.name) LIKE LOWER(CONCAT('%', :origin, '%'))) AND " +
           "(:destination IS NULL OR LOWER(f.destination.code) LIKE LOWER(CONCAT('%', :destination, '%')) OR LOWER(f.destination.name) LIKE LOWER(CONCAT('%', :destination, '%'))) AND " +
           "(:originPlanet IS NULL OR LOWER(f.origin.planet.name) LIKE LOWER(CONCAT('%', :originPlanet, '%'))) AND " +
           "(:destinationPlanet IS NULL OR LOWER(f.destination.planet.name) LIKE LOWER(CONCAT('%', :destinationPlanet, '%'))) AND " +
           "(:departure IS NULL OR f.departure >= :departure) AND " +
           "(:arrival IS NULL OR f.arrival <= :arrival)")
    Page<Flight> searchFlightsWithPagination(
            @Param("origin") String origin, 
            @Param("destination") String destination, 
            @Param("originPlanet") String originPlanet, 
            @Param("destinationPlanet") String destinationPlanet, 
            @Param("departure") java.time.LocalDateTime departure,
            @Param("arrival") java.time.LocalDateTime arrival,
            Pageable pageable
    );

    boolean existsByOriginCodeOrDestinationCode(String origin, String destination);
}