package com.hospital.hms.soap;

import com.hospital.hms.entity.Appointment;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.repository.AppointmentRepository;
import com.hospital.hms.repository.PatientRepository;
import com.hospital.hms.soap.model.AppointmentRecord;
import com.hospital.hms.soap.model.GetPatientReportRequest;
import com.hospital.hms.soap.model.GetPatientReportResponse;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.util.List;

@Endpoint
public class PatientReportEndpoint {

    private static final String NAMESPACE_URI = "http://hospital.com/hms/soap/patient";

    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public PatientReportEndpoint(PatientRepository patientRepository, AppointmentRepository appointmentRepository) {
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @PayloadRoot(namespace = NAMESPACE_URI, localPart = "getPatientReportRequest")
    @ResponsePayload
    public GetPatientReportResponse getPatientReport(@RequestPayload GetPatientReportRequest request) {
        Patient patient = patientRepository.findById(request.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient with ID " + request.getPatientId() + " not found"));

        List<Appointment> appointments = appointmentRepository.findByPatientId(patient.getId());

        GetPatientReportResponse response = new GetPatientReportResponse();
        response.setPatientId(patient.getId());
        response.setPatientName(patient.getName());

        for (Appointment app : appointments) {
            AppointmentRecord record = new AppointmentRecord(
                    app.getId(),
                    app.getDoctor().getName(),
                    app.getDoctor().getSpecialization(),
                    app.getAppointmentDate().toString(),
                    app.getStatus().name(),
                    app.getReason()
            );
            response.getAppointments().add(record);
        }

        return response;
    }
}