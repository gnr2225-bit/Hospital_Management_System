package com.hospital.hms.config;

import com.hospital.hms.entity.*;
import com.hospital.hms.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

/** Loads clearly synthetic local evaluation records into an empty H2 database. */
@Component
public class DemoDataInitializer implements CommandLineRunner {
    private final DoctorRepository doctors;
    private final PatientRepository patients;
    private final AppointmentRepository appointments;
    private final PrescriptionRepository prescriptions;
    private final HospitalRepository hospitals;

    public DemoDataInitializer(DoctorRepository doctors, PatientRepository patients,
                               AppointmentRepository appointments, PrescriptionRepository prescriptions,
                               HospitalRepository hospitals) {
        this.doctors = doctors;
        this.patients = patients;
        this.appointments = appointments;
        this.prescriptions = prescriptions;
        this.hospitals = hospitals;
    }

    @Override
    public void run(String... args) {
        ensureDoctor("Priya Sharma", "Cardiology");
        ensureDoctor("Arjun Mehta", "Dermatology");
        ensureDoctor("Neha Kapoor", "Pediatrics");
        ensureDoctor("Rohan Verma", "Neurology");
        ensureDoctor("Sara Khan", "General Medicine");
        if (hospitals.count() == 0) {
            Hospital clinic = new Hospital("ArogyaCare Central Clinic", "42 Lakeview Road", "Pune", "+91 20 5550 0144");
            clinic.setDepartments(List.of("Cardiology", "Dermatology", "Pediatrics", "Neurology", "General Medicine"));
            hospitals.save(clinic);
        }

        // Do not mix evaluation records into a database that already contains patient data.
        if (patients.count() != 0) return;

        Patient john = createPatient("John Doe", "john.doe@hospital.com", "9876543210");
        Patient maya = createPatient("Maya Patel", "maya.patel@hospital.com", "9876543211");
        Patient aarav = createPatient("Aarav Shah", "aarav.shah@hospital.com", "9876543212");
        Patient diya = createPatient("Diya Nair", "diya.nair@hospital.com", "9876543213");

        Doctor priya = doctors.findBySpecializationIgnoreCase("Cardiology").stream()
                .filter(d -> d.getName().equalsIgnoreCase("Priya Sharma")).findFirst().orElseThrow();
        Doctor arjun = doctors.findBySpecializationIgnoreCase("Dermatology").stream()
                .filter(d -> d.getName().equalsIgnoreCase("Arjun Mehta")).findFirst().orElseThrow();
        Doctor neha = doctors.findBySpecializationIgnoreCase("Pediatrics").stream()
                .filter(d -> d.getName().equalsIgnoreCase("Neha Kapoor")).findFirst().orElseThrow();
        Doctor sara = doctors.findBySpecializationIgnoreCase("General Medicine").stream()
                .filter(d -> d.getName().equalsIgnoreCase("Sara Khan")).findFirst().orElseThrow();

        Appointment completed = appointments.save(new Appointment(john, priya,
                LocalDate.now().minusDays(5).atTime(10, 0), "Follow-up for blood pressure"));
        completed.setStatus(AppointmentStatus.COMPLETED);
        appointments.save(completed);
        prescriptions.save(new Prescription(completed.getId(), john.getId(), priya.getId(), priya.getName(),
                "Hypertension review", "Blood pressure is improving. Continue monitoring at home.",
                List.of("Amlodipine 5 mg · Once daily · Take after breakfast")));

        appointments.save(new Appointment(john, priya,
                LocalDate.now().plusDays(1).atTime(10, 0), "Routine heart health consultation"));
        appointments.save(new Appointment(maya, arjun,
                LocalDate.now().plusDays(2).atTime(11, 30), "Skin irritation and rash"));
        appointments.save(new Appointment(aarav, sara,
                LocalDate.now().minusDays(1).atTime(14, 0), "Seasonal fever and fatigue"));
        Appointment childVisit = appointments.save(new Appointment(diya, neha,
                LocalDate.now().minusDays(3).atTime(9, 30), "Annual wellness check"));
        childVisit.setStatus(AppointmentStatus.COMPLETED);
        appointments.save(childVisit);
    }

    private Patient createPatient(String name, String email, String phone) {
        return patients.save(new Patient(name, email, phone));
    }

    private void ensureDoctor(String name, String specialization) {
        boolean exists = doctors.findBySpecializationIgnoreCase(specialization).stream()
                .anyMatch(d -> d.getName().equalsIgnoreCase(name));
        if (!exists) doctors.save(new Doctor(name, specialization));
    }
}
