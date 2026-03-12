package shino.api;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import shino.dtos.PlanetDTO;
import shino.mappers.EntityMapper;
import shino.services.PlanetService;

@RestController
@RequestMapping("/api/planets")
public class PlanetController {

    private final PlanetService planetService;
    private final EntityMapper mapper;

    public PlanetController(PlanetService planetService, EntityMapper mapper) {
        this.planetService = planetService;
        this.mapper = mapper;
    }

    @GetMapping
    public List<PlanetDTO> getAllPlanets() {
        return planetService.getAllPlanets().stream()
            .map(mapper::toPlanetDTO)
            .toList();
    }
}