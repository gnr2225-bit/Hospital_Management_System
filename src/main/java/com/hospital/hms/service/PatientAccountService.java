package com.hospital.hms.service;

import com.hospital.hms.dto.PatientAccountRequest;
import com.hospital.hms.dto.PatientLoginRequest;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.entity.PatientAccount;
import com.hospital.hms.repository.PatientAccountRepository;
import com.hospital.hms.repository.PatientRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
public class PatientAccountService {
    private static final Set<String> RESERVED = Set.of("john.doe@hospital.com", "admin@hospital.com", "priya.sharma@hospital.com", "alice.johnson@hospital.com");
    private final PatientRepository patients;
    private final PatientAccountRepository accounts;
    public PatientAccountService(PatientRepository patients, PatientAccountRepository accounts) {
        this.patients = patients;
        this.accounts = accounts;
    }

    @Transactional
    public Map<String,Object> register(PatientAccountRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        if (RESERVED.contains(email) || patients.existsByEmailIgnoreCase(email) || accounts.existsByEmailIgnoreCase(email)) {
            throw new IllegalStateException("This email is already registered. Sign in or use another email address.");
        }
        Patient patient = patients.save(new Patient(request.getName().trim(), email, request.getContactNumber().trim()));
        String salt = PasswordHasher.salt();
        accounts.save(new PatientAccount(patient, email, salt, PasswordHasher.hash(request.getPassword(), salt)));
        return session(patient);
    }

    @Transactional(readOnly = true)
    public Map<String,Object> login(PatientLoginRequest request) {
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);
        PatientAccount account = accounts.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password for the selected role."));
        if (!PasswordHasher.matches(request.getPassword(), account.getPasswordSalt(), account.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password for the selected role.");
        }
        return session(account.getPatient());
    }

    private Map<String,Object> session(Patient patient) {
        Map<String,Object> user = new LinkedHashMap<>();
        user.put("role", "patient");
        user.put("email", patient.getEmail());
        user.put("name", patient.getName());
        user.put("patientId", patient.getId());
        user.put("doctorId", null);
        return user;
    }
}
