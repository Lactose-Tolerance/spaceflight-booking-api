package shino.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import shino.dtos.PortRequestDTO;
import shino.entities.Planet;
import shino.entities.Port;
import shino.exceptions.ResourceNotFoundException;
import shino.repositories.PlanetRepository;
import shino.repositories.PortRepository;

@Service
public class PortService {

    private final PortRepository portRepository;
    private final PlanetRepository planetRepository;

    public PortService(PortRepository portRepository, PlanetRepository planetRepository) {
        this.portRepository = portRepository;
        this.planetRepository = planetRepository;
    }

    public List<Port> getPorts(String planet, String country) {
        if (planet != null) {
            return portRepository.findAll().stream()
                .filter(port -> port.getPlanet() != null && port.getPlanet().getName().equalsIgnoreCase(planet))
                .filter(port -> country == null || (port.getCountry() != null && port.getCountry().equalsIgnoreCase(country)))
                .toList();
        }
        return portRepository.findAll();
    }

    public Port getPortByCode(String code) {
        return portRepository.findById(code)
            .orElseThrow(() -> new ResourceNotFoundException("Could not find port with code: " + code));
    }

    @Transactional
    public Port addPort(PortRequestDTO request) {
        if (portRepository.existsById(request.code())) {
            throw new RuntimeException("A port with code " + request.code() + " already exists!");
        }

        Planet planetEntity = planetRepository.findByName(request.planetName().toLowerCase())
            .orElseThrow(() -> new ResourceNotFoundException("Planet not found with Name: " + request.planetName()));

        Port newPort = new Port(
            request.code(), request.name(), request.country(), planetEntity,
            Port.getPortType(request.type()), request.latitude(), request.longitude(),
            request.semiMajorAxis(), request.semiMinorAxis(), request.inclination()
        );

        return portRepository.save(newPort);
    }

    @Transactional
    public void deletePort(String code) {
        if (!portRepository.existsById(code)) {
            throw new ResourceNotFoundException("Cannot delete. Port " + code + " does not exist.");
        }
        portRepository.deleteById(code);
    }
}