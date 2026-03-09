package shino.dtos;

public record PortRequestDTO(
        String code,
        String name,
        String country,
        String planetName,
        String type,
        Double latitude,
        Double longitude,
        Double semiMajorAxis,
        Double semiMinorAxis,
        Double inclination
) {}