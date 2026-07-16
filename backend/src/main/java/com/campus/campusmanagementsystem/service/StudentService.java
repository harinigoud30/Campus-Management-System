package com.campus.campusmanagementsystem.service;

import java.util.List;
import java.util.Optional;

import com.campus.campusmanagementsystem.entity.Student;

public interface StudentService {

    // Create Student
    Student saveStudent(Student student);

    // Get All Students
    List<Student> getAllStudents();

    // Get Student By ID
    Optional<Student> getStudentById(Long studentId);

    // Update Student
    Student updateStudent(Long studentId, Student student);

    // Delete Student
    void deleteStudent(Long studentId);
}