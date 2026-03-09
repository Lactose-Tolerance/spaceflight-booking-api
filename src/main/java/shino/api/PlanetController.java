package shino.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import shino.dtos.PlanetDTO;
import shino.repositories.PlanetRepository;

import java.util.List;

import shino.dtos.DTOMapper;

@RestController
@RequestMapping("/api/planets")
public class PlanetController {

    private final PlanetRepository planetRepository;

    public PlanetController(PlanetRepository planetRepository) {
        this.planetRepository = planetRepository;
    }

    @GetMapping
    public List<PlanetDTO> getAllPlanets() {
        return planetRepository.findAll().stream()
            .map(DTOMapper::toPlanetDTO)
            .toList();
    }
}