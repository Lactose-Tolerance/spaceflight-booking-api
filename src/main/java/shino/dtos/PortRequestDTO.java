package shino.dtos;

import jakarta.validation.constraints.NotBlank;

public record PortRequestDTO(
        @NotBlank(message = "Code is required") String code,
        @NotBlank(message = "Name is required") String name,
        String country,
        @NotBlank(message = "Planet name is required") String planetName,
        @NotBlank(message = "Port type is required") String type,
        Double latitude,
        Double longitude,
        Double semiMajorAxis,
        Double semiMinorAxis,
        Double inclination,
        Double argumentOfPeriapsis,
        Double rightAscension
) {}