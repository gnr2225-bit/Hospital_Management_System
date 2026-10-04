package com.hospital.hms.soap.model;

import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "", propOrder = {"patientId"})
@XmlRootElement(name = "getPatientReportRequest", namespace = "http://hospital.com/hms/soap/patient")
public class GetPatientReportRequest {

    @XmlElement(namespace = "http://hospital.com/hms/soap/patient", required = true)
    private Long patientId;

    public GetPatientReportRequest() {}

    public Long getPatientId() { return patientId; }
    public void setPatientId(Long patientId) { this.patientId = patientId; }
}