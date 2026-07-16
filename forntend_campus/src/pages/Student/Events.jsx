import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarDay, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Loader from '../../components/Loader/Loader';

const Events = () => {
  const api = useMockApi();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const list = await api.getCollection('events');
        setEvents(list);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [api]);

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Campus Activity Calendar
        </h1>
        <p className="text-xs text-slate-400">
          Stay updated with technical symposiums, hackathons, sports week, and cultural events.
        </p>
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 dark:border-slate-855 dark:bg-slate-900 shadow-xs">
        <input
          type="text"
          placeholder="Filter events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs outline-hidden focus:border-indigo-500 focus:bg-white dark:border-slate-805 dark:bg-slate-805/50 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-405">No events scheduled.</div>
        ) : (
          filteredEvents.map((evt) => (
            <div 
              key={evt.id} 
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-855 dark:bg-slate-900"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-650 dark:text-indigo-400">
                  <FaCalendarDay />
                  <span>{evt.date} | {evt.time}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-snug">
                  {evt.title}
                </h3>
                <p className="text-[11px] text-slate-450 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {evt.description || 'No description provided.'}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-805 pt-4 mt-4 flex flex-col gap-2 text-[10px] text-slate-400 font-semibold">
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt />
                  <span>Venue: {evt.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <FaUser />
                  <span>Coordinator: {evt.coordinator}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
