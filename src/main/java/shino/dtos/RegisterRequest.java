package shino.dtos;

import shino.entities.User.UserRole;

public record RegisterRequest(
    String username,
    String password,
    UserRole role
) {}