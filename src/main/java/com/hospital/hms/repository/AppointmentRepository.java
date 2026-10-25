package com.hospital.hms.repository;

import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.time.LocalDateTime;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);

    boolean existsByDoctorIdAndAppointmentDateAndStatusNot(Long doctorId, LocalDateTime appointmentDate, AppointmentStatus status);

    boolean existsByPatientIdAndAppointmentDateAndStatusNot(Long patientId, LocalDateTime appointmentDate, AppointmentStatus status);

    boolean existsByDoctorIdAndAppointmentDateAndIdNotAndStatusNot(Long doctorId, LocalDateTime appointmentDate, Long id, AppointmentStatus status);

    boolean existsByPatientIdAndAppointmentDateAndIdNotAndStatusNot(Long patientId, LocalDateTime appointmentDate, Long id, AppointmentStatus status);

    List<Appointment> findByDoctorIdAndAppointmentDateBetweenAndStatusNot(Long doctorId, LocalDateTime start, LocalDateTime end, AppointmentStatus status);

    List<Appointment> findByPatientIdAndAppointmentDateBetweenAndStatusNot(Long patientId, LocalDateTime start, LocalDateTime end, AppointmentStatus status);
}
