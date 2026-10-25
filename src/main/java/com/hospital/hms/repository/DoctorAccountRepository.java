package com.hospital.hms.repository;

import com.hospital.hms.entity.DoctorAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DoctorAccountRepository extends JpaRepository<DoctorAccount, Long> {
    Optional<DoctorAccount> findByEmailIgnoreCase(String email);
    Optional<DoctorAccount> findByDoctor_Id(Long doctorId);
    boolean existsByEmailIgnoreCase(String email);
}
