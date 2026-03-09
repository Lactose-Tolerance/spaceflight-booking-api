package shino.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import shino.entities.Planet;
import java.util.Optional;

public interface PlanetRepository extends JpaRepository<Planet, Long> {
    Optional<Planet> findByName(String name);
}