package shino.dtos;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import shino.entities.FlightStatus;

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

        @NotNull(message = "Flight status is required")
        FlightStatus status,

        @NotEmpty(message = "You must provide at least one seat configuration")
        @Valid
        List<SeatConfigurationDTO> seatConfigurations,

        @NotNull(message = "First class price is required")
        @Positive(message = "First class price must be strictly positive")
        Double firstClassPrice,

        @NotNull(message = "Business class price is required")
        @Positive(message = "Business class price must be strictly positive")
        Double businessPrice,

        @NotNull(message = "Economy class price is required")
        @Positive(message = "Economy class price must be strictly positive")
        Double economyPrice
) {}