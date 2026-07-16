import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarCheck, FaInfoCircle } from 'react-icons/fa';
import Loader from '../../components/Loader/Loader';

const Attendance = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchStudentAttendance = async () => {
      try {
        const id = user?.id || 'STU001';
        const list = await api.getStudentAttendance(id);
        setAttendance(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchStudentAttendance();
    }
  }, [user, api]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  // Calculate overall metrics
  const totalConducted = attendance.reduce((sum, att) => sum + att.classesConducted, 0);
  const totalAttended = attendance.reduce((sum, att) => sum + att.classesAttended, 0);
  const overallPercentage = totalConducted > 0 
    ? Math.round((totalAttended / totalConducted) * 100 * 10) / 10
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          My Attendance Audit
        </h1>
        <p className="text-xs text-slate-400">
          Detailed subject-wise log breakdown. Ensure attendance is maintained above the mandatory 75% threshold.
        </p>
      </div>

      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-indigo-50 p-4 text-indigo-650 dark:bg-slate-800 dark:text-indigo-400">
            <FaCalendarCheck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-sm text-slate-805 dark:text-slate-100">
              Autumn Semester Average
            </h2>
            <p className="text-[10px] text-slate-400 font-medium">
              Calculated across all registered curriculum lectures & labs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-500">Conducted: {totalConducted} Classes</p>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Attended: {totalAttended} Classes</p>
          </div>
          <span className={`inline-flex items-center justify-center rounded-2xl px-4 py-2 font-display text-lg font-black shadow-xs ${
            overallPercentage >= 85 
              ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400' 
              : overallPercentage >= 75
                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
          }`}>
            {overallPercentage}%
          </span>
        </div>
      </div>

      {/* Subject list grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {attendance.map((att, idx) => {
          const percentage = Math.round((att.classesAttended / att.classesConducted) * 100 * 10) / 10;
          
          let alertColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20';
          let borderVal = 'border-slate-100 dark:border-slate-800/80';
          if (percentage < 75) {
            alertColor = 'text-rose-600 dark:text-rose-450 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20';
            borderVal = 'border-rose-100 dark:border-rose-950/20';
          } else if (percentage < 85) {
            alertColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20';
          }

          return (
            <div 
              key={idx} 
              className={`rounded-2xl border bg-white p-5 shadow-xs transition-transform duration-200 hover:scale-101 dark:bg-slate-900 ${borderVal}`}
            >
              <span className={`inline-block rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-3 ${alertColor}`}>
                {percentage}%
              </span>
              
              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-snug">
                {att.subject}
              </h3>
              
              <div className="mt-4 space-y-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Classes Conducted:</span>
                  <span className="text-slate-800 dark:text-slate-300">{att.classesConducted}</span>
                </div>
                <div className="flex justify-between">
                  <span>Classes Attended:</span>
                  <span className="text-slate-850 dark:text-slate-350">{att.classesAttended}</span>
                </div>
                <div className="flex justify-between">
                  <span>Absent Lectures:</span>
                  <span className="text-rose-550 text-rose-500 font-bold">
                    {att.classesConducted - att.classesAttended}
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    percentage < 75 ? 'bg-rose-500' : percentage < 85 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} 
                  style={{ width: `${percentage}%` }} 
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning info if below 75% */}
      {overallPercentage < 75 && (
        <div className="rounded-2xl border border-rose-100 bg-rose-50/20 p-4 text-xs text-rose-700 dark:border-rose-950/20 dark:text-rose-400 flex gap-2.5">
          <FaInfoCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Attendance Warning Alert</h4>
            <p className="mt-1 leading-relaxed font-medium">
              Your overall attendance is currently below the institutional requirement of 75%. Please contact your department mentors and clear any medical or leave logs to avoid exam restrictions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Attendance;
