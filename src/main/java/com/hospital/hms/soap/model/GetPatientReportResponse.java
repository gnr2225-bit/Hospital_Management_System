package com.hospital.hms.soap.model;

import jakarta.xml.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "getPatientReportResponse", namespace = "http://hospital.com/hms/soap/patient")
public class GetPatientReportResponse {

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private Long patientId;

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient")
    private String patientName;

    @XmlElement(name = "appointments", namespace = "http://hospital.com/hms/soap/patient")
    private List<AppointmentRecord> appointments = new ArrayList<>();

    public GetPatientReportResponse() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }

    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }

    public List<AppointmentRecord> getAppointments() { return appointments; }
    public void setAppointments(List<AppointmentRecord> appointments) { this.appointments = appointments; }
}