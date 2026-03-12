CREATE TABLE booking (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_reference VARCHAR(255) NOT NULL UNIQUE,
    booking_time DATETIME NOT NULL,
    user_id INTEGER NOT NULL,
    seat_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (seat_id) REFERENCES seat(id)
);