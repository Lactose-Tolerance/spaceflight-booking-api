package shino.api;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import shino.dtos.PortDTO;
import shino.dtos.PortRequestDTO;
import shino.mappers.EntityMapper;
import shino.services.PortService;

@RestController
@RequestMapping("/api/ports")
public class PortController {

    private final PortService portService;
    private final EntityMapper mapper;

    public PortController(PortService portService, EntityMapper mapper) {
        this.portService = portService;
        this.mapper = mapper;
    }

    @GetMapping
    public List<PortDTO> getPorts(@RequestParam(required = false) String planet, @RequestParam(required = false) String country) {
        return portService.getPorts(planet, country).stream()
            .map(mapper::toPortDTO)
            .toList();
    }

    @GetMapping("/{code}")
    public PortDTO getPortByCode(@PathVariable String code) {
        return mapper.toPortDTO(portService.getPortByCode(code));
    }

    @PostMapping
    public ResponseEntity<PortDTO> addPort(@Valid @RequestBody PortRequestDTO request) {
        return ResponseEntity.ok(mapper.toPortDTO(portService.addPort(request)));
    }
    
    @DeleteMapping("/{code}")
    public String deletePort(@PathVariable String code) {
        portService.deletePort(code);
        return "Port " + code + " has been successfully deleted.";
    }
}