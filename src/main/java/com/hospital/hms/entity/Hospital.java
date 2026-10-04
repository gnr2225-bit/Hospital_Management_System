package com.hospital.hms.entity;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "hospitals")
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String address;
    private String city;
    private String emergencyContact;
    private Double rating = 4.8;

    @ElementCollection
    private List<String> departments = new ArrayList<>();

    public Hospital() {}
    public Hospital(String name, String address, String city, String emergencyContact) {
        this.name = name;
        this.address = address;
        this.city = city;
        this.emergencyContact = emergencyContact;
        this.departments = List.of("Cardiology", "Neurology", "Dermatology", "General Medicine", "Pediatrics");
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getEmergencyContact() { return emergencyContact; }
    public void setEmergencyContact(String emergencyContact) { this.emergencyContact = emergencyContact; }
    public Double getRating() { return rating; }
    public List<String> getDepartments() { return departments; }
    public void setDepartments(List<String> departments) { this.departments = departments; }
}