package com.campus.campusmanagementsystem.service;

import java.util.List;

import com.campus.campusmanagementsystem.entity.Enrollment;

public interface EnrollmentService {

    Enrollment saveEnrollment(Enrollment enrollment);

    List<Enrollment> getAllEnrollments();

    Enrollment getEnrollmentById(Long enrollmentId);

    Enrollment updateEnrollment(Long enrollmentId, Enrollment enrollment);

    void deleteEnrollment(Long enrollmentId);
}