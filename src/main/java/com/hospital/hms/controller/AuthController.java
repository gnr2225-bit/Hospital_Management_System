package com.hospital.hms.controller;

import com.hospital.hms.dto.PatientAccountRequest;
import com.hospital.hms.dto.PatientLoginRequest;
import com.hospital.hms.service.PatientAccountService;
import com.hospital.hms.service.DoctorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final PatientAccountService accounts;
    private final DoctorService doctors;
    public AuthController(PatientAccountService accounts, DoctorService doctors) {
        this.accounts = accounts;
        this.doctors = doctors;
    }
    @PostMapping("/register")
    public ResponseEntity<Map<String,Object>> register(@Valid @RequestBody PatientAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accounts.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@Valid @RequestBody PatientLoginRequest request) {
        return ResponseEntity.ok(accounts.login(request));
    }

    @PostMapping("/doctor/login")
    public ResponseEntity<Map<String,Object>> doctorLogin(@Valid @RequestBody PatientLoginRequest request) {
        return ResponseEntity.ok(doctors.login(request.getEmail(), request.getPassword()));
    }
}
