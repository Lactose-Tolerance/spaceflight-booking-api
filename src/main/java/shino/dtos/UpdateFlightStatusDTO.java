package shino.dtos;

import jakarta.validation.constraints.NotNull;
import shino.entities.FlightStatus;

public record UpdateFlightStatusDTO(
    @NotNull(message = "Status is required")
    FlightStatus status
) {}