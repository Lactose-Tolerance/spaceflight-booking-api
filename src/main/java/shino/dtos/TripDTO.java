package shino.dtos;

import java.util.List;

public record TripDTO(
    List<FlightDTO> legs,
    int totalStops,
    long totalDurationHours,
    double totalEconomyPrice,
    double totalBusinessPrice,
    double totalFirstClassPrice
) {}