package shino.api;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import shino.dtos.DTOMapper;
import shino.entities.Planet;
import shino.entities.Port;
import shino.repositories.PlanetRepository;
import shino.repositories.PortRepository;

import java.util.List;

import shino.dtos.PortDTO;
import shino.dtos.PortRequestDTO;

@RestController
@RequestMapping("/api/ports")
public class PortController {

    private final PortRepository portRepository;
    private final PlanetRepository planetRepository;

    public PortController(PortRepository portRepository, PlanetRepository planetRepository) {
        this.portRepository = portRepository;
        this.planetRepository = planetRepository;
    }

    @GetMapping
    public List<PortDTO> getPorts(@RequestParam(required = false) String planet, @RequestParam(required = false) String country) {
        if (planet != null) {
            return portRepository.findAll().stream()
                .filter(port -> port.getPlanet() != null && port.getPlanet().getName().equalsIgnoreCase(planet))
                .filter(port -> country == null || (port.getCountry() != null && port.getCountry().equalsIgnoreCase(country)))
                .map(DTOMapper::toPortDTO)
                .toList();
        }
        return portRepository.findAll().stream()
            .map(DTOMapper::toPortDTO)
            .toList();
    }

    @GetMapping("/{code}")
    public PortDTO getPortByCode(@PathVariable String code) {
        return portRepository.findById(code)
            .map(DTOMapper::toPortDTO)
            .orElseThrow(() -> new RuntimeException("Could not find port with code: " + code));
    }

@PostMapping
    public ResponseEntity<PortDTO> addPort(@RequestBody PortRequestDTO request) {
        if (portRepository.existsById(request.code())) {
            throw new RuntimeException("A port with code " + request.code() + " already exists!");
        }

        Planet planet = planetRepository.findByName(request.planetName().toLowerCase())
            .orElseThrow(() -> new RuntimeException("Planet not found with Name: " + request.planetName()));

        Port newPort = new Port(
            request.code(),
            request.name(),
            request.country(),
            planet,
            Port.getPortType(request.type()),
            request.latitude(),
            request.longitude(),
            request.semiMajorAxis(),
            request.semiMinorAxis(),
            request.inclination()
        );

        Port savedPort = portRepository.save(newPort);

        return ResponseEntity.ok(DTOMapper.toPortDTO(savedPort));
    }
    
    @DeleteMapping("/{code}")
    public String deletePort(@PathVariable String code) {
        if (!portRepository.existsById(code)) {
            throw new RuntimeException("Cannot delete. Port " + code + " does not exist.");
        }
        portRepository.deleteById(code);
        return "Port " + code + " has been successfully deleted.";
    }
}