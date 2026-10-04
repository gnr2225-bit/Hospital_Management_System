package com.hospital.hms.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "patient_accounts")
public class PatientAccount {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id", nullable = false, unique = true)
    private Patient patient;
    @Column(nullable = false, unique = true, length = 180)
    private String email;
    @Column(nullable = false, length = 128)
    private String passwordSalt;
    @Column(nullable = false, length = 128)
    private String passwordHash;

    protected PatientAccount() {}
    public PatientAccount(Patient patient, String email, String passwordSalt, String passwordHash) {
        this.patient = patient;
        this.email = email;
        this.passwordSalt = passwordSalt;
        this.passwordHash = passwordHash;
    }
    public Patient getPatient() { return patient; }
    public String getPasswordSalt() { return passwordSalt; }
    public String getPasswordHash() { return passwordHash; }
}
