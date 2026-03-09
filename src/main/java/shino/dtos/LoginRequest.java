package shino.dtos;

public record LoginRequest(
    String username,
    String password
) {}