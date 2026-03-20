package shino.config;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Random;
import java.util.Set;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import shino.entities.Booking;
import shino.entities.Flight;
import shino.entities.FlightStatus;
import shino.entities.Planet;
import shino.entities.Port;
import shino.entities.Port.PortType;
import shino.entities.Seat;
import shino.entities.Seat.SeatType;
import shino.entities.User;
import shino.repositories.BookingRepository;
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
    private final BookingRepository bookingRepository;

    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(FlightRepository flightRepository, PortRepository portRepository, SeatRepository seatRepository, 
                          PlanetRepository planetRepository, UserRepository userRepository, BookingRepository bookingRepository, 
                          PasswordEncoder passwordEncoder) {
        this.flightRepository = flightRepository;
        this.portRepository = portRepository;
        this.seatRepository = seatRepository;
        this.planetRepository = planetRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.passwordEncoder = passwordEncoder;
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
            Port lanyue = new Port("LNYCN", "Lanyue Spaceport", "China", moon, PortType.PLANETARY, -84.2512, 60.7011, null, null, null);
            Port lunar = new Port("LGTWY", "Lunar Gateway", "International", moon, PortType.ORBITAL, null, null, 38200.0, 16000.0, 89.873);
            Port martian = new Port("MGTWY", "Martian Gateway", "International", mars, PortType.ORBITAL, null, null, 20370.0, 11630.0, 89.981);

            List<Port> allPorts = List.of(kennedy, vandenberg, baikonur, wenchang, guiana, artemis, lanyue, lunar, martian);
            portRepository.saveAll(allPorts);

            // ==========================================
            // FLIGHT GENERATION ENGINE
            // ==========================================
            List<Flight> allFlights = new ArrayList<>();
            Random random = new Random(42); 
            
            // The anchor date for all data generation and status evaluation
            LocalDateTime simulationDate = LocalDateTime.of(2026, 3, 23, 12, 0);
            
            Port[] earthPorts = {kennedy, vandenberg, baikonur, wenchang, guiana};
            Port[] moonPlanetary = {artemis, lanyue};
            String[] agencies = {"ART", "CNSA", "ESA", "ROS", "ORION", "NOVA", "VANGUARD"};

            // Generate 120 Flights integrated together
            for (int i = 1; i <= 120; i++) {
                Port origin, dest;
                int routeType = random.nextInt(100); // Percentage roll (0-99)
                double fPrice, bPrice, ePrice;
                int durationHours;
                
                if (routeType < 40) { // 40% Earth <-> Lunar Gateway
                    origin = earthPorts[random.nextInt(earthPorts.length)];
                    dest = lunar;
                    if (random.nextBoolean()) { Port temp = origin; origin = dest; dest = temp; }
                    durationHours = 72 + random.nextInt(24);
                    fPrice = 300000; bPrice = 150000; ePrice = 50000;
                    
                } else if (routeType < 70) { // 30% Lunar Gateway <-> Moon Planetary
                    origin = lunar;
                    dest = moonPlanetary[random.nextInt(moonPlanetary.length)];
                    if (random.nextBoolean()) { Port temp = origin; origin = dest; dest = temp; }
                    durationHours = 4 + random.nextInt(8);
                    fPrice = 60000; bPrice = 30000; ePrice = 10000;
                    
                } else if (routeType < 85) { // 15% Earth Suborbital
                    origin = earthPorts[random.nextInt(earthPorts.length)];
                    dest = earthPorts[random.nextInt(earthPorts.length)];
                    while (origin.equals(dest)) dest = earthPorts[random.nextInt(earthPorts.length)];
                    durationHours = 1 + random.nextInt(3);
                    fPrice = 25000; bPrice = 15000; ePrice = 5000;
                    
                } else { // 15% Lunar Gateway <-> Martian Gateway (NO OTHER PORTS)
                    origin = lunar;
                    dest = martian;
                    if (random.nextBoolean()) { Port temp = origin; origin = dest; dest = temp; }
                    durationHours = (200 + random.nextInt(60)) * 24; // 200 to 260 days in hours
                    fPrice = 5000000; bPrice = 1500000; ePrice = 500000;
                }

                // Add slight price variance
                fPrice += random.nextInt(10) * 1000;
                bPrice += random.nextInt(10) * 500;
                ePrice += random.nextInt(10) * 100;

                // Time calculation
                LocalDateTime departure, arrival;
                
                if (routeType >= 85) { 
                    // Special logic for Mars flights due to extreme length
                    // We want some departing around our simulation date, and some arriving around it
                    int offsetDays = random.nextInt(30) - 15; // +/- 15 days from March 23
                    if (random.nextBoolean()) {
                        departure = simulationDate.plusDays(offsetDays).plusHours(random.nextInt(24));
                        arrival = departure.plusHours(durationHours);
                    } else {
                        arrival = simulationDate.plusDays(offsetDays).plusHours(random.nextInt(24));
                        departure = arrival.minusHours(durationHours);
                    }
                } else {
                    // Standard Earth-Moon spacing
                    int offsetHours = random.nextInt(30 * 24) - (15 * 24); 
                    departure = simulationDate.plusHours(offsetHours).plusMinutes(random.nextInt(60));
                    arrival = departure.plusHours(durationHours);
                }

                String flightNum = agencies[random.nextInt(agencies.length)] + "-" + (1000 + i);

                // Dynamically evaluate status based on the fixed simulation date (March 23, 2026)
                FlightStatus status;
                
                if (random.nextDouble() < 0.05) {
                    status = FlightStatus.CANCELLED; 
                } else if (arrival.isBefore(simulationDate)) {
                    status = FlightStatus.ARRIVED;
                } else if (departure.isBefore(simulationDate) && arrival.isAfter(simulationDate)) {
                    status = FlightStatus.IN_TRANSIT;
                } else if (departure.isAfter(simulationDate) && departure.isBefore(simulationDate.plusHours(6))) {
                    status = random.nextDouble() < 0.4 ? FlightStatus.DELAYED : FlightStatus.BOARDING;
                } else {
                    status = random.nextDouble() < 0.1 ? FlightStatus.DELAYED : FlightStatus.SCHEDULED;
                }

                allFlights.add(new Flight(flightNum, origin, dest, departure, arrival, status, fPrice, bPrice, ePrice));
            }

            flightRepository.saveAll(allFlights);

            // ==========================================
            // USER ACCOUNT GENERATION (600 PASSENGERS)
            // ==========================================
            System.out.println("Generating user accounts...");
            String[] firstNames = {"James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda", "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen", "Christopher", "Nancy", "Daniel", "Lisa", "Matthew", "Ashley", "Donald", "Kimberly", "Paul", "Emily"};
            String[] lastNames = {"Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson"};

            Set<String> generatedUsernames = new HashSet<>();
            while(generatedUsernames.size() < 600) {
                String fn = firstNames[random.nextInt(firstNames.length)].toLowerCase();
                String ln = lastNames[random.nextInt(lastNames.length)].toLowerCase();
                generatedUsernames.add(fn + "." + ln + (random.nextInt(900) + 100));
            }

            List<User> normalUsers = new ArrayList<>();
            for(String un : generatedUsernames) {
                normalUsers.add(new User(un, passwordEncoder.encode(un), User.UserRole.ROLE_USER));
            }
            
            // Add the Admin user explicitly
            User admin = new User("admin", passwordEncoder.encode("admin123"), User.UserRole.ROLE_ADMIN);
            normalUsers.add(admin);
            
            userRepository.saveAll(normalUsers);

            // ==========================================
            // SEAT GENERATION (Initially Empty)
            // ==========================================
            List<Seat> allSeats = new ArrayList<>();
            String[] FirstClassSeatLetters = {"A", "B"};
            String[] OtherClassSeatLetters = {"A", "B", "C", "D"};

            for (Flight currentFlight : allFlights) {
                for (int row = 1; row <= 15; row++) {
                    for (String letter : row <= 5 ? FirstClassSeatLetters : OtherClassSeatLetters) {
                        String seatNumber = row + letter;
                        SeatType classType = (row <= 5) ? SeatType.FIRST_CLASS : (row <= 9) ? SeatType.BUSINESS : SeatType.ECONOMY;
                        allSeats.add(new Seat(currentFlight, seatNumber, classType, false));
                    }
                }
            }
            seatRepository.saveAll(allSeats);

            // ==========================================
            // DYNAMIC BOOKING ENGINE
            // ==========================================
            System.out.println("Booking flights based on timeline distribution...");
            List<Booking> allBookings = new ArrayList<>();
            
            for (Flight flight : allFlights) {
                if (flight.getStatus() == FlightStatus.CANCELLED) {
                    continue; // Nobody boards a cancelled flight
                }

                double loadFactor;
                long hoursUntilFlight = ChronoUnit.HOURS.between(simulationDate, flight.getDeparture());
                
                if (hoursUntilFlight < 0) {
                    // Flight in the past: 80% to 100% full
                    loadFactor = 0.80 + (random.nextDouble() * 0.20); 
                } else if (hoursUntilFlight <= 24) {
                    // Departs today: 60% to 90% full
                    loadFactor = 0.60 + (random.nextDouble() * 0.30); 
                } else if (hoursUntilFlight <= 24 * 7) {
                    // Departs this week: 40% to 70% full
                    loadFactor = 0.40 + (random.nextDouble() * 0.30); 
                } else if (hoursUntilFlight <= 24 * 30) {
                    // Departs this month: 15% to 40% full
                    loadFactor = 0.15 + (random.nextDouble() * 0.25); 
                } else {
                    // Departs way in the future: 0% to 15% full
                    loadFactor = random.nextDouble() * 0.15; 
                }

                // Filter seats just for this flight
                List<Seat> flightSeats = new ArrayList<>();
                for (Seat s : allSeats) {
                    if (s.getFlight().equals(flight)) {
                        flightSeats.add(s);
                    }
                }

                Collections.shuffle(flightSeats, random);
                int seatsToBook = (int) (flightSeats.size() * loadFactor);

                for (int i = 0; i < seatsToBook; i++) {
                    Seat seatToBook = flightSeats.get(i);
                    seatToBook.setBooked(true); // Update seat status
                    
                    User randomPassenger = normalUsers.get(random.nextInt(normalUsers.size() - 1)); // Exclude admin
                    Booking booking = new Booking(randomPassenger, seatToBook);
                    
                    // Generate a realistic booking time in the past
                    long maxHoursBefore = 24 * 60; // Up to 60 days before flight
                    long randomHoursBefore = (long) (random.nextDouble() * maxHoursBefore);
                    LocalDateTime simulatedBookingTime = flight.getDeparture().minusHours(randomHoursBefore);
                    
                    // Make sure the booking wasn't made in the "future" relative to our simulation date
                    if(simulatedBookingTime.isAfter(simulationDate)) {
                         simulatedBookingTime = simulationDate.minusHours(random.nextInt(48) + 1); 
                    }
                    
                    booking.setBookingTime(simulatedBookingTime);
                    allBookings.add(booking);
                }
            }
            
            // Save the updated seats and their bookings
            seatRepository.saveAll(allSeats);
            bookingRepository.saveAll(allBookings);

            System.out.println("Database seeding complete! " + normalUsers.size() + " Users, " + allFlights.size() + " Flights, and " + allBookings.size() + " Bookings created.");
        } else {
            System.out.println("Database already contains data. Skipping seeder.");
        }
    }
}