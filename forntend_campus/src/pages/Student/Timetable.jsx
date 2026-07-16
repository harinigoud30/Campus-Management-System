import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Loader from '../../components/Loader/Loader';

const Timetable = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const id = user?.id || 'STU001';
        const stuList = await api.getCollection('students');
        const details = stuList.find(s => s.id === id) || stuList[0];
        
        const schedule = await api.getTimetable(details.course);
        setTimetable(schedule);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchTimetable();
    }
  }, [user, api]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Weekly Lecture Schedule
        </h1>
        <p className="text-xs text-slate-400">
          Review daily scheduled classes, classrooms, and lecture times.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {daysOfWeek.map(day => {
          const slots = timetable[day] || [];
          return (
            <div key={day} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-850 dark:bg-slate-900 flex flex-col min-h-[350px]">
              <h3 className="text-xs font-bold text-slate-850 dark:text-slate-200 border-b border-slate-150 pb-3 mb-4 flex justify-between items-center tracking-wider uppercase">
                <span>{day}</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400">
                  {slots.length} Slots
                </span>
              </h3>

              {slots.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-[10px] text-slate-400 italic py-10">
                  No classes scheduled
                </div>
              ) : (
                <div className="space-y-3 flex-1">
                  {slots.map((slot, idx) => (
                    <div 
                      key={idx} 
                      className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 dark:border-slate-800/80 dark:bg-slate-800/20 hover:bg-slate-50 transition-colors"
                    >
                      <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <FaClock /> {slot.time}
                      </p>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-205 dark:text-slate-200 leading-snug mt-1">
                        {slot.subject}
                      </h4>
                      <p className="text-[9px] text-slate-400 mt-1 font-semibold flex items-center gap-1">
                        <FaUser className="h-2 w-2 shrink-0" /> Instructor: {slot.teacher}
                      </p>
                      <p className="text-[9px] text-slate-405 dark:text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="h-2.5 w-2.5 shrink-0" /> Room: {slot.room}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timetable;
