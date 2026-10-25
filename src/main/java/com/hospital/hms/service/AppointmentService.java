package com.hospital.hms.service;

import com.hospital.hms.dto.AppointmentRequestDTO;
import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.AppointmentStatus;
import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AppointmentService {
    private static final List<LocalTime> DAILY_SLOTS = List.of(
            LocalTime.of(9, 0), LocalTime.of(9, 30), LocalTime.of(10, 0), LocalTime.of(10, 30),
            LocalTime.of(11, 0), LocalTime.of(11, 30), LocalTime.of(14, 0), LocalTime.of(14, 30),
            LocalTime.of(15, 0), LocalTime.of(15, 30), LocalTime.of(16, 0), LocalTime.of(16, 30));

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(AppointmentRepository appointmentRepository,
                              PatientRepository patientRepository,
                              DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }

    @Transactional
    public Appointment bookAppointment(AppointmentRequestDTO dto) {
        // Lock doctor then patient in this fixed order so simultaneous requests cannot pass
        // the availability checks and create duplicate active bookings.
        Doctor doctor = doctorRepository.findByIdForUpdate(dto.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + dto.getDoctorId()));
        Patient patient = patientRepository.findByIdForUpdate(dto.getPatientId())
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + dto.getPatientId()));

        assertNoConflicts(patient.getId(), doctor.getId(), dto.getAppointmentDate(), null);
        return appointmentRepository.save(new Appointment(patient, doctor, dto.getAppointmentDate(), dto.getReason()));
    }

    @Transactional
    public Appointment reschedule(Long appointmentId, LocalDateTime newDate) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));
        if (appointment.getStatus() != AppointmentStatus.SCHEDULED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only scheduled appointments can be rescheduled.");
        }
        if (appointment.getAppointmentDate().isBefore(LocalDateTime.now().plusHours(1))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Rescheduling is locked. Appointments can only be modified at least 1 hour prior to the scheduled time.");
        }
        if (newDate == null || !newDate.isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New appointment date must be in the future.");
        }

        Long doctorId = appointment.getDoctor().getId();
        Long patientId = appointment.getPatient().getId();
        doctorRepository.findByIdForUpdate(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + doctorId));
        patientRepository.findByIdForUpdate(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + patientId));
        assertNoConflicts(patientId, doctorId, newDate, appointmentId);

        appointment.setAppointmentDate(newDate);
        return appointmentRepository.save(appointment);
    }

    public List<Map<String, Object>> getAvailability(Long doctorId, Long patientId, LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.plusDays(1).atStartOfDay().minusNanos(1);
        var doctorBooked = appointmentRepository.findByDoctorIdAndAppointmentDateBetweenAndStatusNot(
                        doctorId, start, end, AppointmentStatus.CANCELLED).stream()
                .map(a -> a.getAppointmentDate().toLocalTime())
                .toList();
        var patientBooked = patientId == null ? List.<LocalTime>of() : appointmentRepository
                .findByPatientIdAndAppointmentDateBetweenAndStatusNot(patientId, start, end, AppointmentStatus.CANCELLED).stream()
                .map(a -> a.getAppointmentDate().toLocalTime()).toList();
        LocalDateTime now = LocalDateTime.now();
        List<Map<String, Object>> result = new ArrayList<>();
        for (LocalTime slot : DAILY_SLOTS) {
            LocalDateTime dateTime = LocalDateTime.of(date, slot);
            result.add(Map.of("dateTime", dateTime, "available", !doctorBooked.contains(slot) && !patientBooked.contains(slot) && dateTime.isAfter(now)));
        }
        return result;
    }

    private void assertNoConflicts(Long patientId, Long doctorId, LocalDateTime date, Long appointmentId) {
        boolean doctorBooked = appointmentId == null
                ? appointmentRepository.existsByDoctorIdAndAppointmentDateAndStatusNot(doctorId, date, AppointmentStatus.CANCELLED)
                : appointmentRepository.existsByDoctorIdAndAppointmentDateAndIdNotAndStatusNot(doctorId, date, appointmentId, AppointmentStatus.CANCELLED);
        if (doctorBooked) {
            throw new IllegalStateException("Doctor is already booked for this slot.");
        }
        boolean patientBooked = appointmentId == null
                ? appointmentRepository.existsByPatientIdAndAppointmentDateAndStatusNot(patientId, date, AppointmentStatus.CANCELLED)
                : appointmentRepository.existsByPatientIdAndAppointmentDateAndIdNotAndStatusNot(patientId, date, appointmentId, AppointmentStatus.CANCELLED);
        if (patientBooked) {
            throw new IllegalStateException("You already have another active appointment scheduled at this time slot.");
        }
    }

    @Transactional
    public Appointment updateStatus(Long appointmentId, AppointmentStatus newStatus) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found with ID: " + appointmentId));
        appointment.setStatus(newStatus);
        return appointmentRepository.save(appointment);
    }
}
