package shino.services;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Service;

import shino.dtos.FlightDTO;
import shino.dtos.TripDTO;
import shino.entities.Flight;
import shino.entities.FlightStatus;
import shino.mappers.EntityMapper;
import shino.repositories.FlightRepository;

@Service
public class TripService {

    private final FlightRepository flightRepository;
    private final EntityMapper mapper;

    // Minimum hours required to safely transfer between ships in zero-G
    private static final int MIN_LAYOVER_HOURS = 2;

    private static final List<FlightStatus> BOOKABLE_STATUSES = List.of(
        FlightStatus.SCHEDULED, FlightStatus.DELAYED
    );

    public TripService(FlightRepository flightRepository, EntityMapper mapper) {
        this.flightRepository = flightRepository;
        this.mapper = mapper;
    }

    public List<TripDTO> searchConnectingFlights(String originCode, String destCode, LocalDate departureDate) {
        List<TripDTO> validTrips = new ArrayList<>();

        originCode = originCode.toUpperCase();
        destCode = destCode.toUpperCase();
        
        // Start searching from midnight on the requested date
        LocalDateTime searchStartTime = departureDate.atStartOfDay();

        // 1. Fetch the next 10 possible starting flights
        List<Flight> firstLegs = flightRepository.findByOrigin_CodeAndDepartureGreaterThanEqualAndStatusInOrderByDepartureAsc(
            originCode, searchStartTime, BOOKABLE_STATUSES
        );

        for (Flight leg1 : firstLegs) {
            Set<String> visitedPorts = new HashSet<>();
            visitedPorts.add(leg1.getOrigin().getCode());
            visitedPorts.add(leg1.getDestination().getCode());

            if (leg1.getDestination().getCode().equals(destCode)) {
                // DIRECT FLIGHT FOUND
                validTrips.add(buildTrip(List.of(leg1)));
            } else {
                // SEARCH FOR LEG 2 (1 Layover)
                LocalDateTime earliestNextBoarding2 = leg1.getArrival().plusHours(MIN_LAYOVER_HOURS);
                
                List<Flight> secondLegs = flightRepository.findByOrigin_CodeAndDepartureGreaterThanEqualAndStatusInOrderByDepartureAsc(
                    leg1.getDestination().getCode(), earliestNextBoarding2, BOOKABLE_STATUSES
                );

                for (Flight leg2 : secondLegs) {
                    // Prevent circular routing (e.g., KNDUS -> LGTWY -> KNDUS)
                    if (visitedPorts.contains(leg2.getDestination().getCode())) continue;
                    
                    Set<String> currentVisited2 = new HashSet<>(visitedPorts);
                    currentVisited2.add(leg2.getDestination().getCode());

                    if (leg2.getDestination().getCode().equals(destCode)) {
                        // 2-LEG FLIGHT FOUND
                        validTrips.add(buildTrip(List.of(leg1, leg2)));
                    } else {
                        // SEARCH FOR LEG 3 (2 Layovers Max)
                        LocalDateTime earliestNextBoarding3 = leg2.getArrival().plusHours(MIN_LAYOVER_HOURS);
                        
                        List<Flight> thirdLegs = flightRepository.findByOrigin_CodeAndDepartureGreaterThanEqualAndStatusInOrderByDepartureAsc(
                            leg2.getDestination().getCode(), earliestNextBoarding3, BOOKABLE_STATUSES
                        );

                        for (Flight leg3 : thirdLegs) {
                            if (currentVisited2.contains(leg3.getDestination().getCode())) continue;

                            if (leg3.getDestination().getCode().equals(destCode)) {
                                // 3-LEG FLIGHT FOUND
                                validTrips.add(buildTrip(List.of(leg1, leg2, leg3)));
                            }
                        }
                    }
                }
            }
        }

        // The Magic: Sort the results by Total Travel Duration (Arrival of last leg - Departure of first leg)
        // This guarantees that routes with massive layovers fall to the bottom, and tight, efficient routes bubble to the top!
        validTrips.sort(Comparator.comparingLong(TripDTO::totalDurationHours));
        
        return validTrips;
    }

    private TripDTO buildTrip(List<Flight> legs) {
        List<FlightDTO> legDTOs = legs.stream().map(mapper::toFlightDTO).toList();
        
        int stops = legs.size() - 1;
        
        LocalDateTime tripStart = legs.get(0).getDeparture();
        LocalDateTime tripEnd = legs.get(legs.size() - 1).getArrival();
        
        // Calculate the absolute total time from leaving the first port to arriving at the final destination
        long totalDuration = ChronoUnit.HOURS.between(tripStart, tripEnd);

        double totalEcon = legs.stream().mapToDouble(Flight::getEconomyPrice).sum();
        double totalBiz = legs.stream().mapToDouble(Flight::getBusinessPrice).sum();
        double totalFirst = legs.stream().mapToDouble(Flight::getFirstClassPrice).sum();

        return new TripDTO(legDTOs, stops, totalDuration, totalEcon, totalBiz, totalFirst);
    }
}