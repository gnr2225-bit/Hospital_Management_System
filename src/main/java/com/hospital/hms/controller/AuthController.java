package com.hospital.hms.controller;

import com.hospital.hms.dto.PatientAccountRequest;
import com.hospital.hms.dto.PatientLoginRequest;
import com.hospital.hms.service.PatientAccountService;
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
    public AuthController(PatientAccountService accounts) { this.accounts = accounts; }
    @PostMapping("/register")
    public ResponseEntity<Map<String,Object>> register(@Valid @RequestBody PatientAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accounts.register(request));
    }
    @PostMapping("/login")
    public ResponseEntity<Map<String,Object>> login(@Valid @RequestBody PatientLoginRequest request) {
        return ResponseEntity.ok(accounts.login(request));
    }
}
