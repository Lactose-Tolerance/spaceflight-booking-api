package shino.services;

import java.util.List;

import org.springframework.stereotype.Service;

import shino.entities.Planet;
import shino.repositories.PlanetRepository;

@Service
public class PlanetService {

    private final PlanetRepository planetRepository;

    public PlanetService(PlanetRepository planetRepository) {
        this.planetRepository = planetRepository;
    }

    public List<Planet> getAllPlanets() {
        return planetRepository.findAll();
    }
}