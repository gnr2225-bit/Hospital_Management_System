package com.hospital.hms.controller;

import com.hospital.hms.entity.Doctor;
import com.hospital.hms.service.DoctorService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @PostMapping
    public ResponseEntity<Doctor> registerDoctor(@RequestBody Doctor doctor) {
        return new ResponseEntity<>(doctorService.registerDoctor(doctor), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getDoctors(
            @RequestParam(required = false) String specialization) {
        return ResponseEntity.ok(doctorService.getDoctors(specialization));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(doctorService.getDoctorById(id));
    }
}
