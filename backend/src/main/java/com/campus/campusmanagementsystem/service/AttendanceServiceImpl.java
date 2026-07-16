package com.campus.campusmanagementsystem.service;
import com.campus.campusmanagementsystem.exception.ResourceNotFoundException;
import com.campus.campusmanagementsystem.entity.Attendance;
import com.campus.campusmanagementsystem.entity.Course;
import com.campus.campusmanagementsystem.entity.Student;
import com.campus.campusmanagementsystem.repository.AttendanceRepository;
import com.campus.campusmanagementsystem.repository.CourseRepository;
import com.campus.campusmanagementsystem.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AttendanceServiceImpl implements AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Override
    public Attendance saveAttendance(Attendance attendance) {

        Student student = studentRepository.findById(
                attendance.getStudent().getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(
                attendance.getCourse().getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        attendance.setStudent(student);
        attendance.setCourse(course);

        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAllAttendances() {
        return attendanceRepository.findAll();
    }

    @Override
    public Attendance getAttendanceById(Long attendanceId) {
        return attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with ID: " + attendanceId));
    }

    @Override
    public Attendance updateAttendance(Long attendanceId, Attendance attendance) {

        Attendance existingAttendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with ID: " + attendanceId));

        Student student = studentRepository.findById(
                attendance.getStudent().getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(
                attendance.getCourse().getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        existingAttendance.setStudent(student);
        existingAttendance.setCourse(course);
        existingAttendance.setAttendanceDate(attendance.getAttendanceDate());
        existingAttendance.setStatus(attendance.getStatus());

        return attendanceRepository.save(existingAttendance);
    }

    @Override
    public void deleteAttendance(Long attendanceId) {

        Attendance existingAttendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new ResourceNotFoundException("Attendance not found with ID: " + attendanceId));

        attendanceRepository.delete(existingAttendance);
    }
}