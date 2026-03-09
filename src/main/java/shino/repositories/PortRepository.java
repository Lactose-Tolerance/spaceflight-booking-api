package shino.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import shino.entities.Port;

@Repository
public interface PortRepository extends JpaRepository<Port, String> {
}