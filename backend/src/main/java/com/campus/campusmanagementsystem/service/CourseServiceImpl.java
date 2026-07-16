package com.campus.campusmanagementsystem.service;

import java.util.List;
import com.campus.campusmanagementsystem.exception.ResourceNotFoundException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.campusmanagementsystem.entity.Course;
import com.campus.campusmanagementsystem.repository.CourseRepository;

@Service
public class CourseServiceImpl implements CourseService {

    @Autowired
    private CourseRepository courseRepository;

    // Create Course
    @Override
    public Course saveCourse(Course course) {
        return courseRepository.save(course);
    }

    // Get All Courses
    @Override
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get Course By ID
    @Override
    public Optional<Course> getCourseById(Long courseId) {
        return courseRepository.findById(courseId);
    }

    // Update Course
    @Override
    public Course updateCourse(Long courseId, Course course) {

        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        existingCourse.setCourseCode(course.getCourseCode());
        existingCourse.setCourseName(course.getCourseName());
        existingCourse.setCredits(course.getCredits());
        existingCourse.setDepartment(course.getDepartment());

        return courseRepository.save(existingCourse);
    }

    // Delete Course
    @Override
    public void deleteCourse(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with ID: " + courseId));

        courseRepository.delete(course);
    }
}