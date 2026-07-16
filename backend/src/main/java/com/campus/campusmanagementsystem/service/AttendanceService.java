package com.campus.campusmanagementsystem.service;

import com.campus.campusmanagementsystem.entity.Attendance;

import java.util.List;

public interface AttendanceService {

    Attendance saveAttendance(Attendance attendance);

    List<Attendance> getAllAttendances();

    Attendance getAttendanceById(Long attendanceId);

    Attendance updateAttendance(Long attendanceId, Attendance attendance);

    void deleteAttendance(Long attendanceId);
}