package shino.config;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import shino.entities.Flight;
import shino.entities.Planet;
import shino.entities.Port;
import shino.entities.Port.PortType;
import shino.entities.Seat;
import shino.entities.Seat.SeatType;
import shino.entities.User;
import shino.repositories.FlightRepository;
import shino.repositories.PlanetRepository;
import shino.repositories.PortRepository;
import shino.repositories.SeatRepository;
import shino.repositories.UserRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final FlightRepository flightRepository;
    private final PortRepository portRepository;
    private final SeatRepository seatRepository;
    private final PlanetRepository planetRepository;
    private final UserRepository userRepository;

    public DatabaseSeeder(FlightRepository flightRepository, PortRepository portRepository, SeatRepository seatRepository, PlanetRepository planetRepository, UserRepository userRepository) {
        this.flightRepository = flightRepository;
        this.portRepository = portRepository;
        this.seatRepository = seatRepository;
        this.planetRepository = planetRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (portRepository.count() == 0) {
            System.out.println("Seeding relational database with initial data...");

            Planet earth = new Planet("Earth", 6371.0);
            Planet mars = new Planet("Mars", 3389.5);
            Planet moon = new Planet("Moon", 1737.4);
            
            planetRepository.saveAll(List.of(earth, mars, moon));

            Port kennedy = new Port("KNDUS", "Kennedy Space Center", "United States of America", earth, PortType.PLANETARY, 28.5721, -80.6480, null, null, null);
            Port vandenberg = new Port("VSFUS", "Vandenberg Space Force Base", "United States of America", earth, PortType.PLANETARY, 34.7420, -120.5724, null, null, null);
            Port baikonur = new Port("BAIRS", "Baikonur Cosmodrome", "Russia", earth, PortType.PLANETARY, 46.0681, 63.3159, null, null, null);
            Port wenchang = new Port("WENCN", "Wenchang Spacecraft Launch Site", "China", earth, PortType.PLANETARY, 19.6167, 109.7500, null, null, null);
            Port guiana = new Port("GUIFR", "Guiana Space Centre", "France", earth, PortType.PLANETARY, 5.2333, -52.7667, null, null, null);
            Port artemis = new Port("ARTUS", "Artemis Base Station", "United States of America", moon, PortType.PLANETARY, -89.5273, 209.9762, null, null, null);
            Port lanyue = new Port("LNYCN", "Lanyue Spaceport", "China", moon, PortType.ORBITAL, -84.2512, 60.7011, null, null, null);
            Port lunar = new Port("LGTWY", "Lunar Gateway", "International", moon, PortType.ORBITAL, null, null, 38200.0, 16000.0, 89.873);
            Port martian = new Port("MGTWY", "Martian Gateway", "International", mars, PortType.ORBITAL, null, null, 20370.0, 11630.0, 89.981);

            List<Port> allPorts = List.of(kennedy, vandenberg, baikonur, wenchang, guiana, artemis, lanyue, lunar, martian);
            portRepository.saveAll(allPorts);

            Flight f1 = new Flight("ART-101", kennedy, lunar, LocalDateTime.parse("2026-04-10T08:00"), LocalDateTime.parse("2026-04-13T14:00"), "Scheduled", 300000.0, 150000.0, 50000.0);
            Flight f2 = new Flight("CNSA-88", wenchang, lunar, LocalDateTime.parse("2026-04-12T09:30"), LocalDateTime.parse("2026-04-15T11:00"), "Scheduled", 270000.0, 135000.0, 45000.0);
            Flight f3 = new Flight("ESA-202", guiana, lunar, LocalDateTime.parse("2026-05-01T14:00"), LocalDateTime.parse("2026-05-04T18:30"), "In Transit", 315000.0, 157500.0, 52500.0);
            Flight f4 = new Flight("ROS-77", baikonur, lunar, LocalDateTime.parse("2026-03-20T11:00"), LocalDateTime.parse("2026-03-23T15:00"), "Delayed", 255000.0, 127500.0, 42500.0);
            Flight f5 = new Flight("CNSA-99", wenchang, lanyue, LocalDateTime.parse("2026-05-10T07:00"), LocalDateTime.parse("2026-05-13T10:00"), "Scheduled", 270000.0, 135000.0, 45000.0);
            Flight f6 = new Flight("LSH-01", lunar, artemis, LocalDateTime.parse("2026-04-14T08:00"), LocalDateTime.parse("2026-04-14T12:00"), "Scheduled", 60000.0, 30000.0, 10000.0);
            Flight f7 = new Flight("LSH-02", lunar, lanyue, LocalDateTime.parse("2026-04-16T09:00"), LocalDateTime.parse("2026-04-16T13:00"), "Scheduled", 54000.0, 27000.0, 9000.0);
            Flight f8 = new Flight("MGS-500", lunar, martian, LocalDateTime.parse("2026-06-01T06:00"), LocalDateTime.parse("2027-02-15T10:00"), "Boarding", 5000000.0, 1500000.0, 500000.0);
            Flight f9 = new Flight("SUB-04", vandenberg, kennedy, LocalDateTime.parse("2026-03-15T09:00"), LocalDateTime.parse("2026-03-15T10:30"), "In Transit", 25000.0, 15000.0, 5000.0);
            Flight f10 = new Flight("ART-102", lunar, kennedy, LocalDateTime.parse("2026-04-20T10:00"), LocalDateTime.parse("2026-04-23T16:00"), "Scheduled", 300000.0, 150000.0, 50000.0);
            Flight f11 = new Flight("ESA-203", lunar, guiana, LocalDateTime.parse("2026-05-10T12:00"), LocalDateTime.parse("2026-05-13T17:30"), "Scheduled", 315000.0, 157500.0, 52500.0);
            Flight f12 = new Flight("LSH-01R", artemis, lunar, LocalDateTime.parse("2026-04-18T08:00"), LocalDateTime.parse("2026-04-18T12:00"), "Scheduled", 60000.0, 30000.0, 10000.0);
            Flight f13 = new Flight("LSH-02R", lanyue, lunar, LocalDateTime.parse("2026-04-20T09:00"), LocalDateTime.parse("2026-04-20T13:00"), "Scheduled", 54000.0, 27000.0, 9000.0);
            Flight f14 = new Flight("ART-DIR-1", artemis, kennedy, LocalDateTime.parse("2026-04-25T06:00"), LocalDateTime.parse("2026-04-28T14:00"), "Scheduled", 330000.0, 165000.0, 55000.0);
            Flight f15 = new Flight("CNSA-DIR-1", lanyue, wenchang, LocalDateTime.parse("2026-05-20T08:00"), LocalDateTime.parse("2026-05-23T15:00"), "Scheduled", 300000.0, 150000.0, 50000.0);
            Flight f16 = new Flight("MGS-501", martian, lunar, LocalDateTime.parse("2026-01-15T00:00"), LocalDateTime.parse("2026-09-10T12:00"), "In Transit", 5000000.0, 1500000.0, 500000.0);
            Flight f17 = new Flight("SUB-05", baikonur, vandenberg, LocalDateTime.parse("2026-03-12T14:00"), LocalDateTime.parse("2026-03-12T15:30"), "Scheduled", 21250.0, 12750.0, 4250.0);

            List<Flight> allFlights = List.of(
                    f1, f2, f3, f4, f5, f6, f7, f8, f9, 
                    f10, f11, f12, f13, f14, f15, f16, f17
            );
            
            flightRepository.saveAll(allFlights);

            List<Seat> allSeats = new ArrayList<>();
            String[] FirstClassSeatLetters = {"A", "B"};
            String[] OtherClassSeatLetters = {"A", "B", "C", "D"};

            for (Flight currentFlight : allFlights) {
                for (int row = 1; row <= 15; row++) {
                    for (String letter : row <= 5 ? FirstClassSeatLetters : OtherClassSeatLetters) {
                        String seatNumber = row + letter;
                        SeatType classType = (row <= 5) ? SeatType.FIRST_CLASS : (row <= 9) ? SeatType.BUSINESS : SeatType.ECONOMY;
                        boolean isBooked = Math.random() < 0.5;
                        allSeats.add(new Seat(currentFlight, seatNumber, classType, isBooked));
                    }
                }
            }

            seatRepository.saveAll(allSeats);

            User admin = new User("admin", "admin123", User.UserRole.ROLE_ADMIN);

            userRepository.save(admin);

            System.out.println("Database seeding complete! " + allFlights.size() + " flights and " + allSeats.size() + " seats created.");
        } else {
            System.out.println("Database already contains data. Skipping seeder.");
        }
    }
}