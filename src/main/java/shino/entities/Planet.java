package shino.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Planet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(nullable = false)
    private Double radiusKm;

    public Planet() {}

    public Planet(String name, Double radiusKm) {
        this.name = name;
        this.radiusKm = radiusKm;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public Double getRadiusKm() { return radiusKm; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setRadiusKm(Double radiusKm) { this.radiusKm = radiusKm; }
}