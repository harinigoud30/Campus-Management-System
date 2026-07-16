import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/Loader/Loader';
import { FaHotel, FaBed, FaWifi, FaUtensils, FaInfoCircle } from 'react-icons/fa';

const StudentHostel = () => {
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [students, setStudents] = useState([]);
  const [messMenu, setMessMenu] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState('');
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  useEffect(() => {
    if (user?.id) setRoom(mockDb.getStudentRoom(user.id));
    setStudents(mockDb.getCollection('students'));
    setMessMenu(mockDb.getMessMenu());
    const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
    setActiveDay(today);
    setLoading(false);
  }, [user]);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  const occupantNames = room?.occupants?.map(oid => students.find(s => s.id === oid)?.name || oid) || [];
  const todayMenu = messMenu[activeDay] || {};

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Hostel</h1>
        <p className="text-xs text-slate-400 mt-0.5">View your room details and mess schedule.</p>
      </div>

      {/* Room Details */}
      {room ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Room card */}
          <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <FaHotel className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl">Room {room.roomNumber}</h2>
                <p className="text-indigo-200 text-sm">{room.blockName}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-indigo-200">Type</span><span className="font-semibold">{room.type}</span></div>
              <div className="flex justify-between"><span className="text-indigo-200">Floor</span><span className="font-semibold">Floor {room.floor}</span></div>
              <div className="flex justify-between"><span className="text-indigo-200">Capacity</span><span className="font-semibold">{room.capacity} students</span></div>
              <div className="flex justify-between"><span className="text-indigo-200">Monthly Rent</span><span className="font-semibold">₹{room.monthlyRent.toLocaleString()}</span></div>
              <div className="pt-2 border-t border-white/20">
                <p className="text-indigo-200 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map(a => (
                    <span key={a} className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-medium">{a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Roommates */}
          <div className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm p-6">
            <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100 mb-4">Roommates</h3>
            {occupantNames.length === 0 ? (
              <p className="text-sm text-slate-400">No roommates currently.</p>
            ) : (
              <div className="space-y-3">
                {room.occupants.map((oid, i) => {
                  const stu = students.find(s => s.id === oid);
                  const isMe = oid === user?.id;
                  return (
                    <div key={oid} className={`flex items-center gap-3 rounded-2xl p-3 ${isMe ? 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50' : 'bg-slate-50 dark:bg-slate-800/50'}`}>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${isMe ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                        {occupantNames[i]?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">{occupantNames[i]} {isMe && <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">(You)</span>}</p>
                        <p className="text-xs text-slate-400">{stu?.rollNo || ''} · {stu?.course || ''}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 p-6 flex items-start gap-3">
          <FaInfoCircle className="text-amber-500 text-lg shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">No Room Allotted</h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mt-0.5">You have not been allotted a hostel room yet. Please contact the hostel admin office for room allotment.</p>
          </div>
        </div>
      )}

      {/* Mess Menu */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
          <FaUtensils className="text-indigo-500" />
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Mess Menu</h3>
        </div>
        {/* Day selector */}
        <div className="flex gap-1 p-3 overflow-x-auto border-b border-slate-100 dark:border-slate-800">
          {days.map(day => (
            <button key={day} onClick={() => setActiveDay(day)} className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${activeDay === day ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
              {day}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5">
          {['breakfast', 'lunch', 'snacks', 'dinner'].map(meal => (
            <div key={meal} className="rounded-2xl bg-slate-50 dark:bg-slate-800/50 p-4">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 capitalize">{meal}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{todayMenu[meal] || '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentHostel;
