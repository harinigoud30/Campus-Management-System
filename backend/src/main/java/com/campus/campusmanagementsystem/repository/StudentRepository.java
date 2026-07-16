package com.campus.campusmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.campus.campusmanagementsystem.entity.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

}