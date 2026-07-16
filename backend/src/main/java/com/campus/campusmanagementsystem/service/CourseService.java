package com.campus.campusmanagementsystem.service;

import java.util.List;
import java.util.Optional;

import com.campus.campusmanagementsystem.entity.Course;

public interface CourseService {

    // Create Course
    Course saveCourse(Course course);

    // Get All Courses
    List<Course> getAllCourses();

    // Get Course By ID
    Optional<Course> getCourseById(Long courseId);

    // Update Course
    Course updateCourse(Long courseId, Course course);

    // Delete Course
    void deleteCourse(Long courseId);
}