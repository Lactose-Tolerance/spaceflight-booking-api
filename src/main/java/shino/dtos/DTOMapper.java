package shino.dtos;

import shino.entities.Booking;
import shino.entities.Flight;
import shino.entities.Planet;
import shino.entities.Port;
import shino.entities.Seat;

public class DTOMapper {

    public static PortDTO toPortDTO(Port port) {
        return new PortDTO(
            port.getCode(),
            port.getName(),
            port.getCountry(),
            port.getPlanet().getName(),
            port.getType(),
            port.getLatitude(),
            port.getLongitude(),
            port.getSemiMajorAxis(),
            port.getSemiMinorAxis(),
            port.getInclination()
        );
    }

    public static FlightDTO toFlightDTO(Flight flight) {
        if (flight == null) return null;
        return new FlightDTO(
            flight.getId(),
            flight.getFlightNumber(),
            toPortDTO(flight.getOrigin()),
            toPortDTO(flight.getDestination()),
            flight.getDeparture(),
            flight.getArrival(),
            flight.getStatus()
        );
    }

    public static SeatDTO toSeatDTO(Seat seat) {
        if (seat == null) return null;
        Flight flight = seat.getFlight();
        
        return new SeatDTO(
            seat.getId(),
            seat.getSeatNumber(),
            seat.getClassType(),
            seat.isBooked(),
            flight != null ? flight.getFlightNumber() : "Unknown Flight",
            (flight != null && flight.getOrigin() != null) ? flight.getOrigin().getCode() : "Unknown Origin",
            (flight != null && flight.getDestination() != null) ? flight.getDestination().getCode() : "Unknown Destination",
            flight != null ? flight.getDeparture() : null,
            flight != null ? flight.getArrival() : null
        );
    }

    public static BookingDTO toBookingDTO(Booking booking) {
        return new BookingDTO(
            booking.getBookingReference(),

            booking.getSeat().getFlight().getFlightNumber(),
            booking.getSeat().getFlight().getOrigin().getCode() + " (" + booking.getSeat().getFlight().getOrigin().getPlanet().getName() + ")",
            booking.getSeat().getFlight().getDestination().getCode() + " (" + booking.getSeat().getFlight().getDestination().getPlanet().getName() + ")",
            booking.getSeat().getFlight().getDeparture(),

            booking.getSeat().getSeatNumber(),
            booking.getSeat().getClassType().name(),
            
            booking.getBookingTime()
        );
    }
    
    public static BoardingPassDTO toBoardingPassDTO(Booking booking) {
        return new BoardingPassDTO(
                booking.getUser().getUsername(), 
                booking.getBookingReference(),
                booking.getSeat().getFlight().getFlightNumber(),
                booking.getSeat().getFlight().getOrigin().getCode(),
                booking.getSeat().getFlight().getOrigin().getName(),
                booking.getSeat().getFlight().getOrigin().getPlanet().getName(),
                booking.getSeat().getFlight().getDestination().getCode(),
                booking.getSeat().getFlight().getDestination().getName(),
                booking.getSeat().getFlight().getDestination().getPlanet().getName(),
                booking.getSeat().getFlight().getDeparture(),
                booking.getSeat().getFlight().getArrival(),
                booking.getSeat().getSeatNumber(),
                booking.getSeat().getClassType().name()
        );
    }

    public static PlanetDTO toPlanetDTO(Planet planet) {
        if (planet == null) return null;
        return new PlanetDTO(
            planet.getId(),
            planet.getName(),
            planet.getRadiusKm()
        );
    }
}