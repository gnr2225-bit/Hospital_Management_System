package com.hospital.hms.controller;

import com.hospital.hms.entity.*;
import com.hospital.hms.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class HealthcareOperationsController {

    private final HospitalRepository hospitalRepo;
    private final PrescriptionRepository prescriptionRepo;
    private final MedicineOrderRepository orderRepo;
    private final ReviewRepository reviewRepo;
    private final AppointmentRepository appointmentRepo;

    public HealthcareOperationsController(HospitalRepository hospitalRepo,
                                          PrescriptionRepository prescriptionRepo,
                                          MedicineOrderRepository orderRepo,
                                          ReviewRepository reviewRepo,
                                          AppointmentRepository appointmentRepo) {
        this.hospitalRepo = hospitalRepo;
        this.prescriptionRepo = prescriptionRepo;
        this.orderRepo = orderRepo;
        this.reviewRepo = reviewRepo;
        this.appointmentRepo = appointmentRepo;
    }

    // Hospitals
    @GetMapping("/hospitals")
    public List<Hospital> getHospitals() {
        return hospitalRepo.findAll();
    }

    @PostMapping("/hospitals")
    public Hospital createHospital(@RequestBody Hospital hospital) {
        return hospitalRepo.save(hospital);
    }

    // Prescriptions
    @PostMapping("/prescriptions")
    public Prescription createPrescription(@RequestBody Prescription prescription) {
        Prescription saved = prescriptionRepo.save(prescription);
        if (prescription.getAppointmentId() != null) {
            appointmentRepo.findById(prescription.getAppointmentId()).ifPresent(app -> {
                app.setStatus(AppointmentStatus.COMPLETED);
                appointmentRepo.save(app);
            });
        }
        return saved;
    }

    @GetMapping("/patients/{patientId}/prescriptions")
    public List<Prescription> getPatientPrescriptions(@PathVariable Long patientId) {
        return prescriptionRepo.findByPatientId(patientId);
    }

    // Medicine Orders
    @PostMapping("/orders")
    public MedicineOrder placeOrder(@RequestBody MedicineOrder order) {
        return orderRepo.save(order);
    }

    @GetMapping("/orders")
    public List<MedicineOrder> getAllOrders() {
        return orderRepo.findAll();
    }

    @GetMapping("/patients/{patientId}/orders")
    public List<MedicineOrder> getPatientOrders(@PathVariable Long patientId) {
        return orderRepo.findByPatientId(patientId);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<MedicineOrder> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> body) {
        return orderRepo.findById(orderId).map(order -> {
            order.setStatus(body.getOrDefault("status", "CONFIRMED"));
            return ResponseEntity.ok(orderRepo.save(order));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Reviews (Enforcing Rule: Completed Appointment Required)
    @PostMapping("/reviews")
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        List<Appointment> apps = appointmentRepo.findByPatientId(review.getPatientId());
        boolean hasCompleted = apps.stream()
                .anyMatch(a -> a.getDoctor().getId().equals(review.getDoctorId()) && a.getStatus() == AppointmentStatus.COMPLETED);

        if (!hasCompleted) {
            return ResponseEntity.badRequest().body(Map.of("error", "You can only review a doctor after a completed consultation."));
        }
        return ResponseEntity.ok(reviewRepo.save(review));
    }

    @GetMapping("/doctors/{doctorId}/reviews")
    public List<Review> getDoctorReviews(@PathVariable Long doctorId) {
        return reviewRepo.findByDoctorIdAndStatus(doctorId, "APPROVED");
    }

    @GetMapping("/admin/reviews")
    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    @PutMapping("/admin/reviews/{id}/status")
    public ResponseEntity<Review> moderateReview(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return reviewRepo.findById(id).map(r -> {
            r.setStatus(body.getOrDefault("status", "APPROVED"));
            return ResponseEntity.ok(reviewRepo.save(r));
        }).orElse(ResponseEntity.notFound().build());
    }
}