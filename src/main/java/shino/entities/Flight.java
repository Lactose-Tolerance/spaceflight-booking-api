package shino.entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Entity
public class Flight {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Flight number is required")
    private String flightNumber;
    
    @NotNull(message = "Origin port is required")
    @ManyToOne
    @JoinColumn(name = "origin_code") 
    private Port origin;
    
    @NotNull(message = "Destination port is required")
    @ManyToOne
    @JoinColumn(name = "destination_code")
    private Port destination;
    
    @NotNull(message = "Departure time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    // @Future(message = "Departure time must be in the future")
    private LocalDateTime departure;

    @NotNull(message = "Arrival time is required")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    // @Future(message = "Arrival time must be in the future")
    private LocalDateTime arrival;

    @NotBlank(message = "Status is required")
    private String status;

    @NotNull(message = "First class price is required")
    private Double firstClassPrice;

    @NotNull(message = "Business class price is required")
    private Double businessPrice;

    @NotNull(message = "Economy class price is required")
    private Double economyPrice;

    public Flight() {}

    public Flight(String flightNumber, Port origin, Port destination, LocalDateTime departure, LocalDateTime arrival, String status, Double firstClassPrice, Double businessPrice, Double economyPrice) {
        this.flightNumber = flightNumber;
        this.origin = origin;
        this.destination = destination;
        this.departure = departure;
        this.arrival = arrival;
        this.status = status;
        this.firstClassPrice = firstClassPrice;
        this.businessPrice = businessPrice;
        this.economyPrice = economyPrice;
    }

    public Long getId() { return id; }
    public String getFlightNumber() { return flightNumber; }
    public Port getOrigin() { return origin; }
    public Port getDestination() { return destination; }
    public LocalDateTime getDeparture() { return departure; }
    public LocalDateTime getArrival() { return arrival; }
    public String getStatus() { return status; }
    public Double getFirstClassPrice() { return firstClassPrice; }
    public Double getBusinessPrice() { return businessPrice; }
    public Double getEconomyPrice() { return economyPrice; }
    
    public void setId(Long id) { this.id = id; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }
    public void setOrigin(Port origin) { this.origin = origin; }
    public void setDestination(Port destination) { this.destination = destination; }
    public void setDeparture(LocalDateTime departure) { this.departure = departure; }
    public void setArrival(LocalDateTime arrival) { this.arrival = arrival; }
    public void setStatus(String status) { this.status = status; }
    public void setFirstClassPrice(Double firstClassPrice) { this.firstClassPrice = firstClassPrice; }
    public void setBusinessPrice(Double businessPrice) { this.businessPrice = businessPrice; }
    public void setEconomyPrice(Double economyPrice) { this.economyPrice = economyPrice; }
}