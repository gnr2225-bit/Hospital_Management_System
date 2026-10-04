package com.hospital.hms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_reviews")
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long doctorId;
    private Long patientId;
    private String patientName;
    private Integer rating;
    private String comment;
    private String status = "APPROVED";
    private LocalDateTime createdAt = LocalDateTime.now();

    public Review() {}
    public Review(Long doctorId, Long patientId, String patientName, Integer rating, String comment) {
        this.doctorId = doctorId;
        this.patientId = patientId;
        this.patientName = patientName;
        this.rating = rating;
        this.comment = comment;
    }

    public Long getId() { return id; }
    public Long getDoctorId() { return doctorId; }
    public Long getPatientId() { return patientId; }
    public String getPatientName() { return patientName; }
    public Integer getRating() { return rating; }
    public String getComment() { return comment; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}