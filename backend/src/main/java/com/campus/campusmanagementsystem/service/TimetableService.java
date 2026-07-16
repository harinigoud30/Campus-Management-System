package com.campus.campusmanagementsystem.service;

import java.util.List;

import com.campus.campusmanagementsystem.entity.Timetable;

public interface TimetableService {

    Timetable saveTimetable(Timetable timetable);

    List<Timetable> getAllTimetables();

    Timetable getTimetableById(Long timetableId);

    Timetable updateTimetable(Long timetableId, Timetable timetable);

    void deleteTimetable(Long timetableId);
}