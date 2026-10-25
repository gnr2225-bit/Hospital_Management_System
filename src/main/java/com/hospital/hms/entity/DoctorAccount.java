package com.hospital.hms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctor_accounts")
public class DoctorAccount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "doctor_id", nullable = false, unique = true)
    private Doctor doctor;

    @Column(nullable = false, unique = true, length = 180)
    private String email;

    @Column(nullable = false, length = 128)
    private String passwordSalt;

    @Column(nullable = false, length = 128)
    private String passwordHash;

    protected DoctorAccount() {}

    public DoctorAccount(Doctor doctor, String email, String passwordSalt, String passwordHash) {
        this.doctor = doctor;
        this.email = email;
        this.passwordSalt = passwordSalt;
        this.passwordHash = passwordHash;
    }

    public Doctor getDoctor() { return doctor; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordSalt() { return passwordSalt; }
    public void setPasswordSalt(String passwordSalt) { this.passwordSalt = passwordSalt; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
}
