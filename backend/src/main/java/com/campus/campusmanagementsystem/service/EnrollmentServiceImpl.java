package com.campus.campusmanagementsystem.service;

import com.campus.campusmanagementsystem.entity.Course;
import com.campus.campusmanagementsystem.exception.ResourceNotFoundException;
import com.campus.campusmanagementsystem.entity.Enrollment;
import com.campus.campusmanagementsystem.entity.Student;
import com.campus.campusmanagementsystem.repository.CourseRepository;
import com.campus.campusmanagementsystem.repository.EnrollmentRepository;
import com.campus.campusmanagementsystem.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnrollmentServiceImpl implements EnrollmentService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public Enrollment saveEnrollment(Enrollment enrollment) {

        Student student = studentRepository.findById(
                enrollment.getStudent().getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(
                enrollment.getCourse().getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        enrollment.setStudent(student);
        enrollment.setCourse(course);

        return enrollmentRepository.save(enrollment);
    }

    @Override
    public List<Enrollment> getAllEnrollments() {
        return enrollmentRepository.findAll();
    }

    @Override
    public Enrollment getEnrollmentById(Long enrollmentId) {
        return enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with ID: " + enrollmentId));
    }

    @Override
    public Enrollment updateEnrollment(Long enrollmentId, Enrollment enrollment) {

        Enrollment existingEnrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with ID: " + enrollmentId));

        Student student = studentRepository.findById(
                enrollment.getStudent().getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(
                enrollment.getCourse().getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        existingEnrollment.setStudent(student);
        existingEnrollment.setCourse(course);

        return enrollmentRepository.save(existingEnrollment);
    }

    @Override
    public void deleteEnrollment(Long enrollmentId) {

        Enrollment existingEnrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with ID: " + enrollmentId));

        enrollmentRepository.delete(existingEnrollment);
    }
}