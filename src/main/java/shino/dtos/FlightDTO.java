package shino.dtos;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

public record FlightDTO(
    Long id,
    String flightNumber,
    PortDTO origin,
    PortDTO destination,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime departure,
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime arrival,
    String status
) {}