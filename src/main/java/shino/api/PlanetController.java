package shino.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import shino.dtos.PlanetDTO;
import shino.mappers.EntityMapper;
import shino.repositories.PlanetRepository;

@RestController
@RequestMapping("/api/planets")
public class PlanetController {

    private final PlanetRepository planetRepository;
    private final EntityMapper mapper;

    public PlanetController(PlanetRepository planetRepository, EntityMapper mapper) {
        this.planetRepository = planetRepository;
        this.mapper = mapper;
    }

    @GetMapping
    public List<PlanetDTO> getAllPlanets() {
        return planetRepository.findAll().stream()
            .map(mapper::toPlanetDTO)
            .toList();
    }
}