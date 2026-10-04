package com.hospital.hms.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "medicine_orders")
public class MedicineOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;
    private String patientName;
    private String items;
    private Double totalAmount;
    private String deliveryAddress;
    private String status = "PLACED";
    private LocalDateTime orderDate = LocalDateTime.now();

    public MedicineOrder() {}
    public MedicineOrder(Long patientId, String patientName, String items, Double totalAmount, String deliveryAddress) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.items = items;
        this.totalAmount = totalAmount;
        this.deliveryAddress = deliveryAddress;
    }

    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public String getPatientName() { return patientName; }
    public String getItems() { return items; }
    public Double getTotalAmount() { return totalAmount; }
    public String getDeliveryAddress() { return deliveryAddress; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getOrderDate() { return orderDate; }
}