package shino.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import shino.entities.Seat.SeatType;

public record SeatDTO(
    Long id,
    String seatNumber,
    SeatType classType,
    boolean booked,
    String flightNumber,
    String origin,
    String destination,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departure,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")LocalDateTime arrival
) {}