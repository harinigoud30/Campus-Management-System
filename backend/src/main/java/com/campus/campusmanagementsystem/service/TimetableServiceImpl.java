package com.campus.campusmanagementsystem.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.campus.campusmanagementsystem.entity.Timetable;
import com.campus.campusmanagementsystem.exception.ResourceNotFoundException;
import com.campus.campusmanagementsystem.repository.TimetableRepository;

@Service
public class TimetableServiceImpl implements TimetableService {

    @Autowired
    private TimetableRepository timetableRepository;

    @Override
    public Timetable saveTimetable(Timetable timetable) {
        return timetableRepository.save(timetable);
    }

    @Override
    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    @Override
    public Timetable getTimetableById(Long timetableId) {
        return timetableRepository.findById(timetableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Timetable not found with ID: " + timetableId));
    }

    @Override
    public Timetable updateTimetable(Long timetableId, Timetable timetableDetails) {

        Timetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Timetable not found with ID: " + timetableId));

        timetable.setCourse(timetableDetails.getCourse());
        timetable.setFaculty(timetableDetails.getFaculty());
        timetable.setDay(timetableDetails.getDay());
        timetable.setStartTime(timetableDetails.getStartTime());
        timetable.setEndTime(timetableDetails.getEndTime());
        timetable.setRoom(timetableDetails.getRoom());

        return timetableRepository.save(timetable);
    }

    @Override
    public void deleteTimetable(Long timetableId) {

        Timetable timetable = timetableRepository.findById(timetableId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Timetable not found with ID: " + timetableId));

        timetableRepository.delete(timetable);
    }
}