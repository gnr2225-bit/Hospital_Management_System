package com.hospital.hms.repository;

import com.hospital.hms.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByDoctorIdAndStatus(Long doctorId, String status);
    List<Review> findByDoctorId(Long doctorId);
}