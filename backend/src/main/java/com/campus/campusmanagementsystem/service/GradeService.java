package com.campus.campusmanagementsystem.service;

import com.campus.campusmanagementsystem.entity.Grade;

import java.util.List;

public interface GradeService {

    Grade saveGrade(Grade grade);

    List<Grade> getAllGrades();

    Grade getGradeById(Long gradeId);

    Grade updateGrade(Long gradeId, Grade grade);

    void deleteGrade(Long gradeId);
}