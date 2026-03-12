CREATE TABLE port_new (
    code VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    country VARCHAR(255),
    planet_id INTEGER REFERENCES planet(id),
    type VARCHAR(255) DEFAULT 'PLANETARY',
    latitude REAL,
    longitude REAL,
    semi_major_axis REAL,
    semi_minor_axis REAL,
    inclination REAL
);

INSERT INTO port_new SELECT code, name, country, planet_id, type, latitude, longitude, semi_major_axis, semi_minor_axis, inclination FROM port;

DROP TABLE port;
ALTER TABLE port_new RENAME TO port;