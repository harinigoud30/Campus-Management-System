package com.campus.campusmanagementsystem.service;

import java.util.List;
import java.util.Optional;

import com.campus.campusmanagementsystem.entity.Faculty;

public interface FacultyService {

    // Create Faculty
    Faculty saveFaculty(Faculty faculty);

    // Get All Faculty
    List<Faculty> getAllFaculty();

    // Get Faculty By ID
    Optional<Faculty> getFacultyById(Long facultyId);

    // Update Faculty
    Faculty updateFaculty(Long facultyId, Faculty faculty);

    // Delete Faculty
    void deleteFaculty(Long facultyId);
}