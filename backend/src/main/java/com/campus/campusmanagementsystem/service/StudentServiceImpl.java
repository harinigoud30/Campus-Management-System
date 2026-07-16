
package com.campus.campusmanagementsystem.service;
import com.campus.campusmanagementsystem.exception.ResourceNotFoundException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.campusmanagementsystem.entity.Student;
import com.campus.campusmanagementsystem.repository.StudentRepository;

@Service
public class StudentServiceImpl implements StudentService {

    @Autowired
    private StudentRepository studentRepository;

    // Create Student
    @Override
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    // Get All Students
    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get Student By ID
    @Override
    public Optional<Student> getStudentById(Long studentId) {
        return studentRepository.findById(studentId);
    }

    // Update Student
    @Override
    public Student updateStudent(Long studentId, Student student) {

    	Student existingStudent = studentRepository.findById(studentId)
    	        .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));
        existingStudent.setFirstName(student.getFirstName());
        existingStudent.setLastName(student.getLastName());
        existingStudent.setEmail(student.getEmail());
        existingStudent.setPhone(student.getPhone());
        existingStudent.setGender(student.getGender());
        existingStudent.setDateOfBirth(student.getDateOfBirth());
        existingStudent.setAddress(student.getAddress());
        existingStudent.setDepartment(student.getDepartment());

        return studentRepository.save(existingStudent);
    }

    // Delete Student
    @Override
    public void deleteStudent(Long studentId) {

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentId));

        studentRepository.delete(student);
    }
}