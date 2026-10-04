package com.hospital.hms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "prescriptions")
public class Prescription {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long appointmentId;
    private Long patientId;
    private Long doctorId;
    private String doctorName;
    private String diagnosis;
    private String clinicalNotes;
    private LocalDateTime issuedAt = LocalDateTime.now();

    @ElementCollection
    private List<String> medicines = new ArrayList<>();

    public Prescription() {}
    public Prescription(Long appointmentId, Long patientId, Long doctorId, String doctorName, String diagnosis, String clinicalNotes, List<String> medicines) {
        this.appointmentId = appointmentId;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.diagnosis = diagnosis;
        this.clinicalNotes = clinicalNotes;
        this.medicines = medicines;
    }

    public Long getId() { return id; }
    public Long getAppointmentId() { return appointmentId; }
    public Long getPatientId() { return patientId; }
    public Long getDoctorId() { return doctorId; }
    public String getDoctorName() { return doctorName; }
    public String getDiagnosis() { return diagnosis; }
    public String getClinicalNotes() { return clinicalNotes; }
    public LocalDateTime getIssuedAt() { return issuedAt; }
    public List<String> getMedicines() { return medicines; }
    public void setMedicines(List<String> medicines) { this.medicines = medicines; }
}