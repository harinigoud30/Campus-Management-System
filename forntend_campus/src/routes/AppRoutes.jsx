import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Layouts
import AdminLayout from '../layouts/AdminLayout';
import FacultyLayout from '../layouts/FacultyLayout';
import StudentLayout from '../layouts/StudentLayout';

// Auth Pages
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import ForgotPassword from '../pages/Authentication/ForgotPassword';
import ResetPassword from '../pages/Authentication/ResetPassword';

// Admin Pages
import AdminDashboard from '../pages/Admin/Dashboard';
import AdminStudents from '../pages/Admin/Students';
import AdminFaculty from '../pages/Admin/Faculty';
import AdminDepartments from '../pages/Admin/Departments';
import AdminCourses from '../pages/Admin/Courses';
import AdminSubjects from '../pages/Admin/Subjects';
import AdminAttendance from '../pages/Admin/Attendance';
import AdminTimetable from '../pages/Admin/Timetable';
import AdminFees from '../pages/Admin/Fees';
import AdminNotices from '../pages/Admin/Notices';
import AdminEvents from '../pages/Admin/Events';
import AdminPlacements from '../pages/Admin/Placements';
import AdminReports from '../pages/Admin/Reports';
import AdminSettings from '../pages/Admin/Settings';
import AdminLibrary from '../pages/Admin/Library';
import AdminHostel from '../pages/Admin/Hostel';
import AdminExamSchedule from '../pages/Admin/ExamSchedule';
import AdminLeaveRequests from '../pages/Admin/LeaveRequests';

// Faculty Pages
import FacultyDashboard from '../pages/Faculty/Dashboard';
import FacultyAttendance from '../pages/Faculty/Attendance';
import FacultyAssignments from '../pages/Faculty/Assignments';
import FacultyMarks from '../pages/Faculty/Marks';
import FacultyStudents from '../pages/Faculty/Students';
import FacultyProfile from '../pages/Faculty/Profile';
import FacultyLeaveApplication from '../pages/Faculty/LeaveApplication';

// Student Pages
import StudentDashboard from '../pages/Student/Dashboard';
import StudentAttendance from '../pages/Student/Attendance';
import StudentResults from '../pages/Student/Results';
import StudentAssignments from '../pages/Student/Assignments';
import StudentTimetable from '../pages/Student/Timetable';
import StudentFees from '../pages/Student/Fees';
import StudentNotices from '../pages/Student/Notices';
import StudentEvents from '../pages/Student/Events';
import StudentPlacements from '../pages/Student/Placements';
import StudentProfile from '../pages/Student/Profile';
import StudentLibrary from '../pages/Student/Library';
import StudentHostel from '../pages/Student/Hostel';
import StudentExamSchedule from '../pages/Student/ExamSchedule';
import StudentLeaveApplication from '../pages/Student/LeaveApplication';
import StudentGrievance from '../pages/Student/Grievance';
import StudentCertificate from '../pages/Student/Certificate';

// 404
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route 
        path="/" 
        element={
          isAuthenticated 
            ? <Navigate to={`/${user?.role}/dashboard`} replace /> 
            : <Navigate to="/login" replace />
        } 
      />

      {/* Public Auth Routes */}
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={`/${user?.role}/dashboard`} replace />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to={`/${user?.role}/dashboard`} replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="subjects" element={<AdminSubjects />} />
        <Route path="attendance" element={<AdminAttendance />} />
        <Route path="timetable" element={<AdminTimetable />} />
        <Route path="exam-schedule" element={<AdminExamSchedule />} />
        <Route path="fees" element={<AdminFees />} />
        <Route path="library" element={<AdminLibrary />} />
        <Route path="hostel" element={<AdminHostel />} />
        <Route path="leave-requests" element={<AdminLeaveRequests />} />
        <Route path="notices" element={<AdminNotices />} />
        <Route path="events" element={<AdminEvents />} />
        <Route path="placements" element={<AdminPlacements />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Faculty Protected Routes */}
      <Route path="/faculty" element={<FacultyLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="attendance" element={<FacultyAttendance />} />
        <Route path="assignments" element={<FacultyAssignments />} />
        <Route path="marks" element={<FacultyMarks />} />
        <Route path="students" element={<FacultyStudents />} />
        <Route path="leave" element={<FacultyLeaveApplication />} />
        <Route path="profile" element={<FacultyProfile />} />
      </Route>

      {/* Student Protected Routes */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="assignments" element={<StudentAssignments />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="exam-schedule" element={<StudentExamSchedule />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="library" element={<StudentLibrary />} />
        <Route path="hostel" element={<StudentHostel />} />
        <Route path="leave" element={<StudentLeaveApplication />} />
        <Route path="grievance" element={<StudentGrievance />} />
        <Route path="certificates" element={<StudentCertificate />} />
        <Route path="notices" element={<StudentNotices />} />
        <Route path="events" element={<StudentEvents />} />
        <Route path="placements" element={<StudentPlacements />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* Wildcard 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
