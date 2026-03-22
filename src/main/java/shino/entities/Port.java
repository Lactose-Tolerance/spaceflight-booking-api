package shino.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Port {

    public enum PortType {
        PLANETARY,
        ORBITAL
    }

    public static PortType getPortType(String type) {
        switch (type.toLowerCase().trim()) {
            case "planetary" -> {
                return PortType.PLANETARY;
            }
            case "orbital" -> {
                return PortType.ORBITAL;
            }
            default -> throw new IllegalArgumentException("Invalid port type: " + type);
        }
    }

    @Id 
    private String code;
    private String name;
    private String country;
    
    @ManyToOne
    @JoinColumn(name = "planet_id")
    private Planet planet;

    @Enumerated(EnumType.STRING)
    private PortType type;

    private Double latitude;
    private Double longitude;

    private Double semiMajorAxis;
    private Double semiMinorAxis;
    private Double inclination;
    private Double argumentOfPeriapsis;
    private Double rightAscension;

    public Port() {}

    public Port(String code, String name, String country, Planet planet, PortType type, Double latitude, Double longitude, Double semiMajorAxis, Double semiMinorAxis, Double inclination, Double argumentOfPeriapsis, Double rightAscension) {
        this.code = code;
        this.name = name;
        this.country = country;
        this.planet = planet;
        this.type = type;
        this.latitude = latitude;
        this.longitude = longitude;
        this.semiMajorAxis = semiMajorAxis;
        this.semiMinorAxis = semiMinorAxis;
        this.inclination = inclination;
        this.argumentOfPeriapsis = argumentOfPeriapsis;
        this.rightAscension = rightAscension;
    }

    public String getCode() { return code; }
    public String getName() { return name; }
    public String getCountry() { return country; }
    public Planet getPlanet() { return planet;}
    public PortType getType() { return type; }
    public Double getLatitude() { return latitude; }
    public Double getLongitude() { return longitude; }
    public Double getSemiMajorAxis() { return semiMajorAxis; }
    public Double getSemiMinorAxis() { return semiMinorAxis; }
    public Double getInclination() { return inclination; }
    public Double getArgumentOfPeriapsis() { return argumentOfPeriapsis; }
    public Double getRightAscension() { return rightAscension; }
    
    public void setCode(String code) { this.code = code; }
    public void setName(String name) { this.name = name; }
    public void setCountry(String country) { this.country = country; }
    public void setPlanet(Planet planet) { this.planet = planet; }
    public void setType(PortType type) { this.type = type; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public void setSemiMajorAxis(Double semiMajorAxis) { this.semiMajorAxis = semiMajorAxis; }
    public void setSemiMinorAxis(Double semiMinorAxis) { this.semiMinorAxis = semiMinorAxis; }
    public void setInclination(Double inclination) { this.inclination = inclination; }
    public void setArgumentOfPeriapsis(Double argumentOfPeriapsis) { this.argumentOfPeriapsis = argumentOfPeriapsis; }
    public void setRightAscension(Double rightAscension) { this.rightAscension = rightAscension; }
}