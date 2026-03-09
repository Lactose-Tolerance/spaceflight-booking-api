package shino.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record BoardingPassDTO(
        String passengerName,
        String bookingReference,
        String flightNumber,
        String originCode,
        String originName,
        String originPlanet,
        String destinationCode,
        String destinationName,
        String destinationPlanet,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departureTime,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime arrivalTime,
        String seatNumber,
        String seatClass
) {}