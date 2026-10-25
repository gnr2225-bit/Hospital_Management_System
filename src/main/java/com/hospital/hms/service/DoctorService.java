package com.hospital.hms.service;

import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.DoctorAccount;
import com.hospital.hms.exception.ResourceNotFoundException;
import com.hospital.hms.repository.DoctorAccountRepository;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.PatientAccountRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Locale;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DoctorAccountRepository doctorAccounts;
    private final PatientAccountRepository patientAccounts;

    private static final Set<String> RESERVED_EMAILS = Set.of(
            "admin@hospital.com", "john.doe@hospital.com", "priya.sharma@hospital.com",
            "alice.johnson@hospital.com", "ananya.reddy@hospital.com");

    public DoctorService(DoctorRepository doctorRepository, DoctorAccountRepository doctorAccounts,
                         PatientAccountRepository patientAccounts) {
        this.doctorRepository = doctorRepository;
        this.doctorAccounts = doctorAccounts;
        this.patientAccounts = patientAccounts;
    }

    @Transactional
    public Doctor registerDoctor(Doctor doctor) {
        String email = normalizeEmail(doctor.getLoginEmail());
        String password = doctor.getInitialPassword();
        validateCredentials(email, password, true);
        ensureEmailAvailable(email, null);
        Doctor saved = doctorRepository.save(doctor);
        String salt = PasswordHasher.salt();
        doctorAccounts.save(new DoctorAccount(saved, email, salt, PasswordHasher.hash(password, salt)));
        return saved;
    }

    @Transactional
    public Doctor updateDoctor(Long id, Doctor updates) {
        Doctor doctor = getDoctorById(id);
        doctor.setName(updates.getName());
        doctor.setSpecialization(updates.getSpecialization());
        doctor.setConsultationFee(updates.getConsultationFee());
        doctor.setExperienceYears(updates.getExperienceYears());
        doctor.setQualifications(updates.getQualifications());
        doctor.setBio(updates.getBio());
        doctor.setHospital(updates.getHospital());
        String email = updates.getLoginEmail() == null ? "" : updates.getLoginEmail().trim().toLowerCase(Locale.ROOT);
        String password = updates.getInitialPassword() == null ? "" : updates.getInitialPassword();
        DoctorAccount account = doctorAccounts.findByDoctor_Id(id).orElse(null);
        if (account == null && (!email.isBlank() || !password.isBlank())) {
            validateCredentials(email, password, true);
            ensureEmailAvailable(email, null);
            String salt = PasswordHasher.salt();
            doctorAccounts.save(new DoctorAccount(doctor, email, salt, PasswordHasher.hash(password, salt)));
        } else if (account != null) {
            if (!email.isBlank() && !account.getEmail().equalsIgnoreCase(email)) {
                validateEmail(email);
                ensureEmailAvailable(email, id);
                account.setEmail(email);
            }
            if (!password.isBlank()) {
                validatePassword(password);
                String salt = PasswordHasher.salt();
                account.setPasswordSalt(salt);
                account.setPasswordHash(PasswordHasher.hash(password, salt));
            }
        }
        return doctorRepository.save(doctor);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> login(String suppliedEmail, String password) {
        String email = normalizeEmail(suppliedEmail);
        DoctorAccount account = doctorAccounts.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password for the selected role."));
        if (!PasswordHasher.matches(password, account.getPasswordSalt(), account.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password for the selected role.");
        }
        Map<String, Object> session = new LinkedHashMap<>();
        session.put("role", "doctor");
        session.put("email", account.getEmail());
        session.put("name", account.getDoctor().getName());
        session.put("doctorId", account.getDoctor().getId());
        session.put("patientId", null);
        return session;
    }

    private void validateCredentials(String email, String password, boolean required) {
        if (!required && (email.isBlank() || password.isBlank())) return;
        validateEmail(email);
        validatePassword(password);
    }

    private void validateEmail(String email) {
        if (email.isBlank() || !email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Enter a valid doctor login email.");
        }
        if (RESERVED_EMAILS.contains(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is reserved for a demo account. Choose another login email.");
        }
    }

    private void validatePassword(String password) {
        if (password == null || password.length() < 8 || password.length() > 128) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Doctor password must be between 8 and 128 characters.");
        }
    }

    private void ensureEmailAvailable(String email, Long ignoredDoctorId) {
        boolean usedByDoctor = doctorAccounts.findByEmailIgnoreCase(email)
                .filter(account -> ignoredDoctorId == null || !account.getDoctor().getId().equals(ignoredDoctorId)).isPresent();
        if (usedByDoctor || patientAccounts.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This email is already in use by another account.");
        }
    }

    private String normalizeEmail(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    public List<Doctor> getDoctors(String specialization) {
        if (specialization != null && !specialization.trim().isEmpty()) {
            return doctorRepository.findBySpecializationIgnoreCase(specialization);
        }
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found with ID: " + id));
    }
}
