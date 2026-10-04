package com.hospital.hms;

import com.hospital.hms.entity.Doctor;
import com.hospital.hms.entity.Hospital;
import com.hospital.hms.entity.Patient;
import com.hospital.hms.repository.DoctorRepository;
import com.hospital.hms.repository.HospitalRepository;
import com.hospital.hms.repository.PatientRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class HmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(HmsApplication.class, args);
    }

    @Bean
    CommandLineRunner initDatabase(DoctorRepository doctorRepository,
                                  PatientRepository patientRepository,
                                  HospitalRepository hospitalRepository) {
        return args -> {
            if (doctorRepository.count() == 0) {
                doctorRepository.save(new Doctor("Dr. Alice Johnson", "Cardiology"));
                doctorRepository.save(new Doctor("Dr. Robert Davis", "Neurology"));
                doctorRepository.save(new Doctor("Dr. Priya Sharma", "Dermatology"));
                doctorRepository.save(new Doctor("Dr. David Wilson", "General Medicine"));
                doctorRepository.save(new Doctor("Dr. Ananya Reddy", "Orthopedics"));
            }

            if (patientRepository.count() == 0) {
                patientRepository.save(new Patient("John Doe", "john.doe@hospital.com", "9876543210"));
                patientRepository.save(new Patient("Sarah Connor", "sarah@cyber.com", "9123456789"));
            }

            if (hospitalRepository.count() == 0) {
                hospitalRepository.save(new Hospital("Apollo Central Medical Center", "Ring Road, Sector 4", "Surampalem", "+91 884 2300900"));
                hospitalRepository.save(new Hospital("Care Multispeciality Hospital", "Main Health Boulevard", "Kakinada", "+91 884 2355444"));
            }
        };
    }
}