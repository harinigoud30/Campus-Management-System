import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarCheck, FaGraduationCap, FaMoneyBillWave, FaClock, FaBullhorn, FaBriefcase } from 'react-icons/fa';
import StatsCard from '../../components/Cards/StatsCard';
import Loader from '../../components/Loader/Loader';

const Dashboard = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState(null);
  
  // Dashboard states
  const [attendanceList, setAttendanceList] = useState([]);
  const [results, setResults] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [notices, setNotices] = useState([]);
  const [placements, setPlacements] = useState([]);

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const id = user?.id || 'STU001';
        const stuList = await api.getCollection('students');
        const details = stuList.find(s => s.id === id) || stuList[0];
        setStudentDetails(details);

        // Fetch subject attendances
        const atts = await api.getStudentAttendance(details.id);
        setAttendanceList(atts);

        // Fetch semester GPAs
        const gp = await api.getStudentResults(details.id);
        setResults(gp);

        // Fetch timetable classes
        const schedule = await api.getTimetable(details.course);
        // Compile today's classes (Monday fallback)
        setTimetable(schedule.Monday || []);

        // Fetch notices targeting Student or All
        const nList = await api.getCollection('notices');
        setNotices(nList.filter(n => n.target === 'All' || n.target === 'Student').slice(0, 3));

        // Fetch placements
        const pList = await api.getCollection('placements');
        setPlacements(pList.slice(0, 2));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadStudentData();
    }
  }, [user, api]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  // Calculate overall average attendance
  const averageAtt = attendanceList.length > 0 
    ? Math.round(attendanceList.reduce((sum, att) => sum + (att.classesAttended / att.classesConducted), 0) / attendanceList.length * 100 * 10) / 10
    : studentDetails?.attendance || 0;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Welcome back, {studentDetails?.name}
        </h1>
        <p className="text-xs text-slate-400 font-semibold mt-0.5">
          Program: {studentDetails?.course} | Semester {studentDetails?.semester} | Roll ID: {studentDetails?.rollNo}
        </p>
      </div>

      {/* Stats Cards row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Overall Attendance"
          value={`${averageAtt}%`}
          icon={<FaCalendarCheck />}
          trend={averageAtt >= 75 ? "Consistent" : "Low Turnout"}
          trendType={averageAtt >= 75 ? "positive" : "negative"}
          description="Requirement: 75%"
        />
        <StatsCard
          title="Cumulative CGPA"
          value={studentDetails?.cgpa || '8.9'}
          icon={<FaGraduationCap />}
          trend="Top 10%"
          trendType="positive"
          description="Updated last semester"
        />
        <StatsCard
          title="Outstanding Fees"
          value={`$${studentDetails?.balanceFees.toLocaleString() || '0'}`}
          icon={<FaMoneyBillWave />}
          trend={studentDetails?.balanceFees > 0 ? "Pending Payment" : "Paid"}
          trendType={studentDetails?.balanceFees > 0 ? "negative" : "positive"}
          description="Due for Autumn semester"
        />
      </div>

      {/* Grid panels */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Today's Lectures */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaClock className="text-indigo-500" /> Today's Lecture Timetable
          </h3>

          {timetable.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No scheduled lectures today.</p>
          ) : (
            <div className="space-y-3">
              {timetable.map((slot, index) => (
                <div 
                  key={index} 
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border border-slate-100 bg-slate-50/40 rounded-xl dark:border-slate-800/80 dark:bg-slate-800/20 hover:bg-slate-50 transition-colors"
                >
                  <div>
                    <span className="font-semibold text-indigo-650 dark:text-indigo-400 text-[10px]">
                      {slot.time}
                    </span>
                    <h4 className="font-bold text-xs text-slate-850 dark:text-slate-200 leading-snug">
                      {slot.subject}
                    </h4>
                  </div>
                  <div className="mt-1 sm:mt-0 text-[10px] text-slate-400 text-left sm:text-right font-medium">
                    <p>Instructor: {slot.teacher}</p>
                    <p>Room: {slot.room}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notices Board Panel */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaBullhorn className="text-indigo-500" /> Announcements board
          </h3>

          {notices.length === 0 ? (
            <p className="text-xs text-slate-400 py-10 text-center">No notices posted.</p>
          ) : (
            <div className="space-y-3.5">
              {notices.map(notice => (
                <div key={notice.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">{notice.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {notice.content}
                  </p>
                  <span className="text-[9px] text-slate-400 block mt-2 font-medium">Released: {notice.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Career Opportunities summary */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaBriefcase className="text-indigo-500" /> Active Placement Drives
          </h3>

          <div className="space-y-3">
            {placements.map(plc => (
              <div key={plc.id} className="p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">{plc.company}</h4>
                <p className="text-[10px] text-slate-400">{plc.designation}</p>
                <p className="text-[10px] text-indigo-600 font-bold dark:text-indigo-400 mt-1">Package: {plc.package}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
