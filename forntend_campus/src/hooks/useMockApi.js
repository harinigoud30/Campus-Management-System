import { useMemo, useCallback } from 'react';
import { mockDb } from '../services/mockData';

export const useMockApi = (delay = 400) => {
  const simulateRequest = useCallback((apiCall) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const result = apiCall();
          resolve(result);
        } catch (err) {
          reject(err);
        }
      }, delay);
    });
  }, [delay]);

  // Stable API method definitions using useCallback
  const getCollection = useCallback((name) => {
    return simulateRequest(() => mockDb.getCollection(name));
  }, [simulateRequest]);

  const getItem = useCallback((collection, id) => {
    return simulateRequest(() => mockDb.getItem(collection, id));
  }, [simulateRequest]);

  const createItem = useCallback((collection, itemData) => {
    return simulateRequest(() => mockDb.createItem(collection, itemData));
  }, [simulateRequest]);

  const updateItem = useCallback((collection, id, itemData) => {
    return simulateRequest(() => mockDb.updateItem(collection, id, itemData));
  }, [simulateRequest]);

  const deleteItem = useCallback((collection, id) => {
    return simulateRequest(() => mockDb.deleteItem(collection, id));
  }, [simulateRequest]);

  const getTimetable = useCallback((courseName) => {
    return simulateRequest(() => mockDb.getTimetable(courseName));
  }, [simulateRequest]);

  const updateTimetable = useCallback((courseName, schedule) => {
    return simulateRequest(() => mockDb.updateTimetable(courseName, schedule));
  }, [simulateRequest]);

  const getStudentAttendance = useCallback((studentId) => {
    return simulateRequest(() => mockDb.getStudentAttendance(studentId));
  }, [simulateRequest]);

  const updateStudentAttendance = useCallback((studentId, subject, incrementAttended, incrementConducted) => {
    return simulateRequest(() => mockDb.updateStudentAttendance(studentId, subject, incrementAttended, incrementConducted));
  }, [simulateRequest]);

  const getStudentResults = useCallback((studentId) => {
    return simulateRequest(() => mockDb.getStudentResults(studentId));
  }, [simulateRequest]);

  const getFeesTransactions = useCallback((studentId) => {
    return simulateRequest(() => mockDb.getFeesTransactions(studentId));
  }, [simulateRequest]);

  const payFees = useCallback((studentId, amount, mode) => {
    return simulateRequest(() => mockDb.payStudentFees(studentId, amount, mode));
  }, [simulateRequest]);

  const getAssignmentsByFaculty = useCallback((facultyName) => {
    return simulateRequest(() => mockDb.getAssignmentsByFaculty(facultyName));
  }, [simulateRequest]);

  const getAssignmentsByCourse = useCallback((courseName) => {
    return simulateRequest(() => mockDb.getAssignmentsByCourse(courseName));
  }, [simulateRequest]);

  const submitAssignment = useCallback((assignmentId, studentId, studentName, rollNo, fileName) => {
    return simulateRequest(() => mockDb.submitAssignment(assignmentId, studentId, studentName, rollNo, fileName));
  }, [simulateRequest]);

  const gradeSubmission = useCallback((assignmentId, studentId, grade) => {
    return simulateRequest(() => mockDb.gradeSubmission(assignmentId, studentId, grade));
  }, [simulateRequest]);

  const getSettings = useCallback(() => {
    return simulateRequest(() => mockDb.getSettings());
  }, [simulateRequest]);

  const updateSettings = useCallback((newSettings) => {
    return simulateRequest(() => mockDb.updateSettings(newSettings));
  }, [simulateRequest]);

  // Return a memoized static API instance object
  return useMemo(() => ({
    getCollection,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getTimetable,
    updateTimetable,
    getStudentAttendance,
    updateStudentAttendance,
    getStudentResults,
    getFeesTransactions,
    payFees,
    getAssignmentsByFaculty,
    getAssignmentsByCourse,
    submitAssignment,
    gradeSubmission,
    getSettings,
    updateSettings
  }), [
    getCollection,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getTimetable,
    updateTimetable,
    getStudentAttendance,
    updateStudentAttendance,
    getStudentResults,
    getFeesTransactions,
    payFees,
    getAssignmentsByFaculty,
    getAssignmentsByCourse,
    submitAssignment,
    gradeSubmission,
    getSettings,
    updateSettings
  ]);
};
