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
           "(:origin IS NULL OR LOWER(f.origin.code) = LOWER(:origin)) AND " +
           "(:destination IS NULL OR LOWER(f.destination.code) = LOWER(:destination)) AND " +
           "(:originPlanet IS NULL OR LOWER(f.origin.planet.name) = LOWER(:originPlanet)) AND " +
           "(:destinationPlanet IS NULL OR LOWER(f.destination.planet.name) = LOWER(:destinationPlanet))")
    Page<Flight> searchFlightsWithPagination(
            @Param("origin") String origin,
            @Param("destination") String destination,
            @Param("originPlanet") String originPlanet,
            @Param("destinationPlanet") String destinationPlanet,
            Pageable pageable
    );
}