package com.hospital.hms.repository;

import com.hospital.hms.entity.PatientAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PatientAccountRepository extends JpaRepository<PatientAccount, Long> {
    Optional<PatientAccount> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
