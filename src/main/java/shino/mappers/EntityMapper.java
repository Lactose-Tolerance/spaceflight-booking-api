package shino.mappers;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import shino.dtos.BoardingPassDTO;
import shino.dtos.BookingDTO;
import shino.dtos.FlightDTO;
import shino.dtos.PlanetDTO;
import shino.dtos.PortDTO;
import shino.dtos.SeatDTO;
import shino.entities.Booking;
import shino.entities.Flight;
import shino.entities.Planet;
import shino.entities.Port;
import shino.entities.Seat;

@Mapper(componentModel = "spring")
public interface EntityMapper {
    
    PlanetDTO toPlanetDTO(Planet planet);

    @Mapping(source = "planet.name", target = "planet")
    PortDTO toPortDTO(Port port);

    FlightDTO toFlightDTO(Flight flight);

    @Mapping(source = "flight.flightNumber", target = "flightNumber", defaultValue = "Unknown Flight")
    @Mapping(source = "flight.origin.code", target = "origin", defaultValue = "Unknown Origin")
    @Mapping(source = "flight.destination.code", target = "destination", defaultValue = "Unknown Destination")
    @Mapping(source = "flight.departure", target = "departure")
    @Mapping(source = "flight.arrival", target = "arrival")
    SeatDTO toSeatDTO(Seat seat);

    @Mapping(source = "seat.flight.flightNumber", target = "flightNumber")
    @Mapping(target = "origin", expression = "java(booking.getSeat().getFlight().getOrigin().getCode() + \" (\" + booking.getSeat().getFlight().getOrigin().getPlanet().getName() + \")\")")
    @Mapping(target = "destination", expression = "java(booking.getSeat().getFlight().getDestination().getCode() + \" (\" + booking.getSeat().getFlight().getDestination().getPlanet().getName() + \")\")")
    @Mapping(source = "seat.flight.departure", target = "departureTime")
    @Mapping(source = "seat.seatNumber", target = "seatNumber")
    @Mapping(source = "seat.classType", target = "seatClass")
    BookingDTO toBookingDTO(Booking booking);

    @Mapping(source = "user.username", target = "passengerName")
    @Mapping(source = "seat.flight.flightNumber", target = "flightNumber")
    @Mapping(source = "seat.flight.origin.code", target = "originCode")
    @Mapping(source = "seat.flight.origin.name", target = "originName")
    @Mapping(source = "seat.flight.origin.planet.name", target = "originPlanet")
    @Mapping(source = "seat.flight.destination.code", target = "destinationCode")
    @Mapping(source = "seat.flight.destination.name", target = "destinationName")
    @Mapping(source = "seat.flight.destination.planet.name", target = "destinationPlanet")
    @Mapping(source = "seat.flight.departure", target = "departureTime")
    @Mapping(source = "seat.flight.arrival", target = "arrivalTime")
    @Mapping(source = "seat.seatNumber", target = "seatNumber")
    @Mapping(source = "seat.classType", target = "seatClass")
    BoardingPassDTO toBoardingPassDTO(Booking booking);
}