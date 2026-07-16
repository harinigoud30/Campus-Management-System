package com.campus.campusmanagementsystem.service;

import java.util.List;
import com.campus.campusmanagementsystem.exception.ResourceNotFoundException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.campusmanagementsystem.entity.Faculty;
import com.campus.campusmanagementsystem.repository.FacultyRepository;

@Service
public class FacultyServiceImpl implements FacultyService {

    @Autowired
    private FacultyRepository facultyRepository;

    // Create Faculty
    @Override
    public Faculty saveFaculty(Faculty faculty) {
        return facultyRepository.save(faculty);
    }

    // Get All Faculty
    @Override
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    // Get Faculty By ID
    @Override
    public Optional<Faculty> getFacultyById(Long facultyId) {
        return facultyRepository.findById(facultyId);
    }

    // Update Faculty
    @Override
    public Faculty updateFaculty(Long facultyId, Faculty faculty) {

        Faculty existingFaculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + facultyId));

        existingFaculty.setFirstName(faculty.getFirstName());
        existingFaculty.setLastName(faculty.getLastName());
        existingFaculty.setEmail(faculty.getEmail());
        existingFaculty.setPhone(faculty.getPhone());
        existingFaculty.setQualification(faculty.getQualification());
        existingFaculty.setSpecialization(faculty.getSpecialization());
        existingFaculty.setDepartment(faculty.getDepartment());

        return facultyRepository.save(existingFaculty);
    }

    // Delete Faculty
    @Override
    public void deleteFaculty(Long facultyId) {

        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with ID: " + facultyId));

        facultyRepository.delete(faculty);
    }
}