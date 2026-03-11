package shino.dtos;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record FlightRequestDTO(
        
        @NotBlank(message = "Flight number cannot be blank")
        @Size(min = 3, max = 10, message = "Flight number must be between 3 and 10 characters")
        String flightNumber,

        @NotBlank(message = "Origin code is required")
        @Size(min = 3, max = 5, message = "Origin code must be 3-5 characters")
        String originCode,

        @NotBlank(message = "Destination code is required")
        @Size(min = 3, max = 5, message = "Destination code must be 3-5 characters")
        String destinationCode,

        @NotNull(message = "Departure time is required")
        LocalDateTime departure,

        @NotNull(message = "Arrival time is required")
        LocalDateTime arrival,

        @NotBlank(message = "Status is required")
        String status
) {}