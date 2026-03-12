package shino.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import shino.entities.Seat.SeatType;

public record SeatConfigurationDTO(
        @NotNull(message = "Seat type is required") 
        SeatType type,
        
        @Min(value = 0, message = "There cannot be negative rows") 
        int rows,
        
        @Min(value = 0, message = "There cannot be negative columns")
        int columns
) {}