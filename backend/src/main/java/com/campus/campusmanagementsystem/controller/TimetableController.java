package com.campus.campusmanagementsystem.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.campus.campusmanagementsystem.entity.Timetable;
import com.campus.campusmanagementsystem.service.TimetableService;

@RestController
@RequestMapping("/api/timetables")
@CrossOrigin(origins = "*")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    // Create Timetable
    @PostMapping
    public Timetable saveTimetable(@Valid @RequestBody Timetable timetable) {
        return timetableService.saveTimetable(timetable);
    }

    // Get All Timetables
    @GetMapping
    public List<Timetable> getAllTimetables() {
        return timetableService.getAllTimetables();
    }

    // Get Timetable By ID
    @GetMapping("/{id}")
    public Timetable getTimetableById(@PathVariable Long id) {
        return timetableService.getTimetableById(id);
    }

    // Update Timetable
    @PutMapping("/{id}")
    public Timetable updateTimetable(@PathVariable Long id,
                                     @Valid @RequestBody Timetable timetable) {
        return timetableService.updateTimetable(id, timetable);
    }

    // Delete Timetable
    @DeleteMapping("/{id}")
    public String deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetable(id);
        return "Timetable deleted successfully!";
    }
}