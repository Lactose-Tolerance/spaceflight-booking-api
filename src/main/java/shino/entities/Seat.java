package shino.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Version;


@Entity
public class Seat {
    public enum SeatType {
        FIRST_CLASS,
        BUSINESS,
        ECONOMY
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    private Integer version;
    
    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;
    
    private String seatNumber;

    @Enumerated(EnumType.STRING)
    private SeatType classType;
    private boolean booked;

    public Seat() {}

    public Seat(Flight flight, String seatNumber, SeatType classType, boolean booked) {
        this.flight = flight;
        this.seatNumber = seatNumber;
        this.classType = classType;
        this.booked = booked;
    }

    public Long getId() { return id; }
    public Integer getVersion() { return version; }
    public Flight getFlight() { return flight; }
    public String getSeatNumber() { return seatNumber; }
    public SeatType getClassType() { return classType; }
    public boolean isBooked() { return booked; } 

    public void setId(Long id) { this.id = id; }
    public void setFlight(Flight flight) { this.flight = flight; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }
    public void setClassType(SeatType classType) { this.classType = classType; }
    public void setBooked(boolean booked) { this.booked = booked; }
}