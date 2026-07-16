package com.campus.campusmanagementsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.campus.campusmanagementsystem.entity.Department;

public interface DepartmentRepository extends JpaRepository<Department, Long> {

}