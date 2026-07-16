package com.campus.campusmanagementsystem.service;
import com.campus.campusmanagementsystem.exception.ResourceNotFoundException;
import com.campus.campusmanagementsystem.entity.Course;
import com.campus.campusmanagementsystem.entity.Grade;
import com.campus.campusmanagementsystem.entity.Student;
import com.campus.campusmanagementsystem.repository.CourseRepository;
import com.campus.campusmanagementsystem.repository.GradeRepository;
import com.campus.campusmanagementsystem.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeServiceImpl implements GradeService {

    @Autowired
    private GradeRepository gradeRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public Grade saveGrade(Grade grade) {

        Student student = studentRepository.findById(
                grade.getStudent().getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(
                grade.getCourse().getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        grade.setStudent(student);
        grade.setCourse(course);

        return gradeRepository.save(grade);
    }

    @Override
    public List<Grade> getAllGrades() {
        return gradeRepository.findAll();
    }

    @Override
    public Grade getGradeById(Long gradeId) {
        return gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with ID: " + gradeId));
    }

    @Override
    public Grade updateGrade(Long gradeId, Grade grade) {

        Grade existingGrade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with ID: " + gradeId));

        Student student = studentRepository.findById(
                grade.getStudent().getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(
                grade.getCourse().getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        existingGrade.setStudent(student);
        existingGrade.setCourse(course);
        existingGrade.setMarks(grade.getMarks());
        existingGrade.setGrade(grade.getGrade());

        return gradeRepository.save(existingGrade);
    }

    @Override
    public void deleteGrade(Long gradeId) {

        Grade existingGrade = gradeRepository.findById(gradeId)
                .orElseThrow(() -> new ResourceNotFoundException("Grade not found with ID: " + gradeId));

        gradeRepository.delete(existingGrade);
    }
}