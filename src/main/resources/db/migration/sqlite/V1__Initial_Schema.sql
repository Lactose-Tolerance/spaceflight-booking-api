CREATE TABLE port (
    code VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    country VARCHAR(255),
    planet VARCHAR(255)
);

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE flight (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    flight_number VARCHAR(255) NOT NULL,
    departure DATETIME NOT NULL,
    arrival DATETIME NOT NULL,
    status VARCHAR(255) NOT NULL,
    origin_code VARCHAR(255) NOT NULL,
    destination_code VARCHAR(255) NOT NULL,
    FOREIGN KEY (origin_code) REFERENCES port(code),
    FOREIGN KEY (destination_code) REFERENCES port(code)
);

CREATE TABLE seat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seat_number VARCHAR(255),
    class_type VARCHAR(255),
    booked BOOLEAN NOT NULL,
    flight_id INTEGER,
    FOREIGN KEY (flight_id) REFERENCES flight(id)
);