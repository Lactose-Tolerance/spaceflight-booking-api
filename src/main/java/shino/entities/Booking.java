package shino.entities;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;

@Entity
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String bookingReference;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToOne
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(nullable = false)
    private LocalDateTime bookingTime;

    public Booking() {}

    public Booking(User user, Seat seat) {
        this.user = user;
        this.seat = seat;
        this.bookingReference = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        this.bookingTime = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getBookingReference() { return bookingReference; }
    public User getUser() { return user; }
    public Seat getSeat() { return seat; }
    public LocalDateTime getBookingTime() { return bookingTime; }

    public void setId(Long id) { this.id = id; }
    public void setBookingReference(String bookingReference) { this.bookingReference = bookingReference; }
    public void setUser(User user) { this.user = user; }
    public void setSeat(Seat seat) { this.seat = seat; }
    public void setBookingTime(LocalDateTime bookingTime) { this.bookingTime = bookingTime; }
}