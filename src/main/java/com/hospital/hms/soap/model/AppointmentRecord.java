package com.hospital.hms.soap.model;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlType;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "appointmentRecord", namespace = "http://hospital.com/hms/soap/patient")
public class AppointmentRecord {

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private Long appointmentId;

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private String doctorName;

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private String specialization;

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private String date;

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private String status;

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private String reason;

    public AppointmentRecord() {}

    public AppointmentRecord(Long appointmentId, String doctorName, String specialization, String date, String status, String reason) {
        this.appointmentId = appointmentId;
        this.doctorName = doctorName;
        this.specialization = specialization;
        this.date = date;
        this.status = status;
        this.reason = reason;
    }

    public Long getAppointmentId() { return appointmentId; }
    public String getDoctorName() { return doctorName; }
    public String getSpecialization() { return specialization; }
    public String getDate() { return date; }
    public String getStatus() { return status; }
    public String getReason() { return reason; }
}