package shino.entities;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum FlightStatus {
    SCHEDULED("Scheduled"),
    CANCELLED("Cancelled"),
    DELAYED("Delayed"),
    BOARDING("Boarding"),
    IN_TRANSIT("In Transit"),
    ARRIVED("Arrived");

    private final String displayName;

    FlightStatus(String displayName) {
        this.displayName = displayName;
    }

    @JsonValue
    public String getDisplayName() {
        return displayName;
    }

    @JsonCreator
    public static FlightStatus fromString(String value) {
        for (FlightStatus status : FlightStatus.values()) {
            if (status.displayName.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        throw new IllegalArgumentException("Unknown status: " + value);
    }
}