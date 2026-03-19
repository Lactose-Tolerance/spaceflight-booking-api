package shino.dtos;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record UpdateFlightPricesDTO(
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