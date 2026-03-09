package shino.dtos;

import shino.entities.Port.PortType;

public record PortDTO(
    String code,
    String name,
    String country,
    String planet,
    PortType type,
    Double latitude,
    Double longitude,
    Double semiMajorAxis,
    Double semiMinorAxis,
    Double inclination
) {}