package shino.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record BookingDTO(
    String bookingReference,

    String flightNumber,
    String origin,
    String destination,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departureTime,

    String seatNumber,
    String seatClass,

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime bookingTime
) {}