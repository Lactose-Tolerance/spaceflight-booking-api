package shino.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import shino.entities.Planet;

public interface PlanetRepository extends JpaRepository<Planet, Long> {
    Optional<Planet> findByNameIgnoreCase(String name);
}