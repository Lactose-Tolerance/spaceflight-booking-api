package shino.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record BookingDTO(
    String bookingReference,
    String status, // ADDED

    String passengerName,
    String flightNumber,
    String origin,
    String destination,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departureTime,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime arrivalTime, // ADDED

    String seatNumber,
    String seatClass,

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime bookingTime
) {}