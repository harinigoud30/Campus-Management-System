import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import Loader from '../../components/Loader/Loader';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaDownload, FaPrint } from 'react-icons/fa';
import { motion } from 'framer-motion';

const StudentExamSchedule = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');

  useEffect(() => {
    const student = user?.details || mockDb.getCollection('students').find(s => s.id === user?.id);
    if (student?.course) {
      setExams(mockDb.getExamsByCourse(student.course));
    } else {
      setExams(mockDb.getCollection('examSchedule'));
    }
    setLoading(false);
  }, [user]);

  const examTypes = [...new Set(exams.map(e => e.examType))];
  const filtered = !filterType ? exams : exams.filter(e => e.examType === filterType);

  const today = new Date().toISOString().split('T')[0];
  const upcoming = filtered.filter(e => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const past = filtered.filter(e => e.date < today).sort((a, b) => b.date.localeCompare(a.date));

  const typeColor = {
    'End Semester': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
    'Mid Semester': 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
    'Internal': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  const ExamCard = ({ exam }) => {
    const isUpcoming = exam.date >= today;
    const daysLeft = Math.ceil((new Date(exam.date) - new Date()) / (1000 * 60 * 60 * 24));
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${isUpcoming ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800' : 'bg-slate-50/50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-70'}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight">{exam.subject}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{exam.subjectCode}</p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${typeColor[exam.examType] || ''}`}>{exam.examType}</span>
            {isUpcoming && daysLeft >= 0 && daysLeft <= 7 && (
              <span className="rounded-full bg-rose-100 dark:bg-rose-950/40 px-2.5 py-0.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                {daysLeft === 0 ? 'Today!' : `${daysLeft}d left`}
              </span>
            )}
          </div>
        </div>
        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2"><FaCalendarAlt className="text-slate-400 shrink-0" /><span className="font-medium text-slate-700 dark:text-slate-300">{exam.date}</span></div>
          <div className="flex items-center gap-2"><FaClock className="text-slate-400 shrink-0" />{exam.time} · {exam.duration}</div>
          <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-slate-400 shrink-0" />{exam.hall}</div>
        </div>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-400">Max: <span className="font-semibold text-slate-700 dark:text-slate-300">{exam.maxMarks} marks</span></span>
          {isUpcoming && (
            <button className="flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
              <FaDownload /> Hall Ticket
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Exam Schedule</h1>
          <p className="text-xs text-slate-400 mt-0.5">View your exam timetable and download hall tickets.</p>
        </div>
        <div className="flex gap-2">
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none">
            <option value="">All Exam Types</option>
            {examTypes.map(t => <option key={t}>{t}</option>)}
          </select>
          <button className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <FaPrint /> Print All
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Exams', value: filtered.length },
          { label: 'Upcoming', value: upcoming.length },
          { label: 'Completed', value: past.length },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FaCalendarAlt} title="No exams scheduled" description="Your exam schedule will appear here once published by admin." />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Upcoming Exams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {upcoming.map(exam => <ExamCard key={exam.id} exam={exam} />)}
              </div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-slate-400 dark:text-slate-500 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span> Past Exams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {past.map(exam => <ExamCard key={exam.id} exam={exam} />)}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default StudentExamSchedule;
