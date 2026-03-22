CREATE TABLE planet (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    radius_km DOUBLE PRECISION NOT NULL
);

CREATE TABLE port (
    code VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    country VARCHAR(255),
    planet_id BIGINT REFERENCES planet(id),
    type VARCHAR(255) DEFAULT 'PLANETARY',
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    semi_major_axis DOUBLE PRECISION,
    semi_minor_axis DOUBLE PRECISION,
    inclination DOUBLE PRECISION,
    argument_of_periapsis DOUBLE PRECISION,
    right_ascension DOUBLE PRECISION
);

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL
);

CREATE TABLE flight (
    id BIGSERIAL PRIMARY KEY,
    flight_number VARCHAR(255) NOT NULL,
    departure TIMESTAMP NOT NULL,
    arrival TIMESTAMP NOT NULL,
    status VARCHAR(255) NOT NULL,
    origin_code VARCHAR(255) NOT NULL REFERENCES port(code),
    destination_code VARCHAR(255) NOT NULL REFERENCES port(code),
    first_class_price DOUBLE PRECISION DEFAULT 0.0 NOT NULL,
    business_price DOUBLE PRECISION DEFAULT 0.0 NOT NULL,
    economy_price DOUBLE PRECISION DEFAULT 0.0 NOT NULL
);

CREATE TABLE seat (
    id BIGSERIAL PRIMARY KEY,
    seat_number VARCHAR(255),
    class_type VARCHAR(255),
    booked BOOLEAN NOT NULL,
    version INTEGER DEFAULT 0,
    flight_id BIGINT REFERENCES flight(id)
);

CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    booking_reference VARCHAR(255) NOT NULL UNIQUE,
    booking_time TIMESTAMP NOT NULL,
    user_id BIGINT NOT NULL REFERENCES users(id),
    seat_id BIGINT NOT NULL UNIQUE REFERENCES seat(id)
);