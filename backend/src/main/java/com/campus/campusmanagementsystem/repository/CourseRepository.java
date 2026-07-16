package com.campus.campusmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campus.campusmanagementsystem.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

}