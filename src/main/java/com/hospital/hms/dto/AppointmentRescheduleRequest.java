package com.hospital.hms.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class AppointmentRescheduleRequest {
    @NotNull(message = "New appointment date/time is required")
    @Future(message = "New appointment date must be in the future")
    private LocalDateTime newAppointmentDate;

    public LocalDateTime getNewAppointmentDate() { return newAppointmentDate; }
    public void setNewAppointmentDate(LocalDateTime newAppointmentDate) { this.newAppointmentDate = newAppointmentDate; }
}
