import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBook, FaUserGraduate, FaClipboardList, FaClock, FaCheckCircle } from 'react-icons/fa';
import StatsCard from '../../components/Cards/StatsCard';
import Loader from '../../components/Loader/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [facultyDetails, setFacultyDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [timetable, setTimetable] = useState([]);

  useEffect(() => {
    const loadFacultyData = async () => {
      try {
        const name = user?.name || 'Dr. Grace Hopper';
        const list = await api.getCollection('faculty');
        const details = list.find(f => f.name === name) || list[1]; // fallback Grace Hopper
        setFacultyDetails(details);

        // Fetch students in CSE (Grace Hopper is in CSE)
        const stuList = await api.getCollection('students');
        const deptStudents = stuList.filter(s => s.department === details.department);
        setStudentsCount(deptStudents.length);

        // Fetch assignments posted by this faculty
        const asnList = await api.getAssignmentsByFaculty(details.name);
        setAssignments(asnList);

        // Compile today's schedule (Monday timetable fallback)
        const schedule = await api.getTimetable(details.courses[0]);
        // Filter classes taught by this faculty member
        const facultySchedule = [];
        Object.keys(schedule).forEach(day => {
          schedule[day].forEach(slot => {
            if (slot.teacher === details.name) {
              facultySchedule.push({ day, ...slot });
            }
          });
        });
        setTimetable(facultySchedule);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadFacultyData();
    }
  }, [user, api]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  // Count ungraded assignments submissions
  const pendingGradingCount = assignments.reduce((sum, asn) => {
    const ungraded = asn.submissions.filter(sub => sub.status === 'Submitted').length;
    return sum + ungraded;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Welcome back, {facultyDetails?.name}
        </h1>
        <p className="text-xs text-slate-400">
          Faculty designation: <strong>{facultyDetails?.designation}</strong> in {facultyDetails?.department}.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Handled Programs"
          value={facultyDetails?.courses.length || 1}
          icon={<FaBook />}
          description="B.Tech & Postgrad modules"
        />
        <StatsCard
          title="Associated Students"
          value={studentsCount}
          icon={<FaUserGraduate />}
          description="Under department branch"
        />
        <StatsCard
          title="Ungraded Scripts"
          value={pendingGradingCount}
          icon={<FaClipboardList />}
          trend={pendingGradingCount > 0 ? "Action Required" : "All Graded"}
          trendType={pendingGradingCount > 0 ? "negative" : "positive"}
          description="Pending submissions review"
        />
      </div>

      {/* Grid: Schedule and Assignments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Lecture Calendar */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaClock className="text-indigo-500" /> Teaching Lecture Schedule
          </h3>

          {timetable.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No assigned lecture slots in weekly timetable</p>
          ) : (
            <div className="space-y-3">
              {timetable.map((slot, index) => (
                <div 
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-slate-100 bg-slate-50/40 rounded-xl dark:border-slate-800/80 dark:bg-slate-800/20 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-705 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 uppercase">
                      {slot.day}
                    </span>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-slate-205 dark:text-slate-200 mt-1">
                      {slot.subject} ({slot.code})
                    </h4>
                  </div>
                  <div className="mt-2 sm:mt-0 text-[10px] text-slate-400 font-medium text-left sm:text-right">
                    <p className="font-semibold text-indigo-650 dark:text-indigo-400">{slot.time}</p>
                    <p className="mt-0.5">Venue room: {slot.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Assignments list */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4">
            Active Assignments
          </h3>

          {assignments.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No posted assignments</p>
          ) : (
            <div className="space-y-4">
              {assignments.map(asn => (
                <div key={asn.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">{asn.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1">Class: {asn.course}</p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400">Due Date: {asn.dueDate}</p>
                  
                  <div className="border-t border-slate-100 dark:border-slate-800 pt-2 mt-2 flex justify-between items-center text-[10px]">
                    <span className="text-slate-400 font-medium">{asn.submissions.length} submitted</span>
                    {asn.submissions.filter(s => s.status === 'Submitted').length > 0 ? (
                      <span className="text-rose-500 font-bold">Needs Grading</span>
                    ) : (
                      <span className="text-emerald-500 flex items-center gap-1 font-semibold"><FaCheckCircle /> Up-to-date</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
