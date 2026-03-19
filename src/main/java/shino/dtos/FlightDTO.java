package shino.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import shino.entities.FlightStatus;

public record FlightDTO(
    Long id,
    String flightNumber,
    PortDTO origin,
    PortDTO destination,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departure,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime arrival,
    FlightStatus status,
    Double firstClassPrice,
    Double businessPrice,
    Double economyPrice
) {}