package shino.dtos;

import java.time.LocalDateTime;

public record FlightRequestDTO(
    String flightNumber,
    String originCode,
    String destinationCode,
    LocalDateTime departure,
    LocalDateTime arrival,
    String status
) {}