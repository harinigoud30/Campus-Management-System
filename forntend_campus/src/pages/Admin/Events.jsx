import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarDay, FaPlus, FaTrash, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Events = () => {
  const api = useMockApi();
  const [events, setEvents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    coordinator: '',
    description: ''
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('events');
      const facList = await api.getCollection('faculty');
      setEvents(list);
      setFaculty(facList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [api]);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      date: '',
      time: '10:00 AM - 04:00 PM',
      location: 'Seminar Hall 1',
      coordinator: faculty[0]?.name || 'Dr. Alan Turing',
      description: ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to cancel this event?')) {
      try {
        await api.deleteItem('events', id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createItem('events', formData);
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Search Filter
  const filteredEvents = events.filter(evt => 
    evt.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Campus Events Calendar
          </h1>
          <p className="text-xs text-slate-400">
            Schedule cultural fests, technical symposiums, hackathons, and guest lectures.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaPlus /> Schedule New Event
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 dark:border-slate-850 dark:bg-slate-900 shadow-xs">
        <input 
          type="text" 
          placeholder="Filter events..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/50 py-1.5 px-3 text-xs outline-hidden focus:border-indigo-500 focus:bg-white dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-250 dark:focus:border-indigo-400 dark:focus:bg-slate-950"
        />
      </div>

      {/* Events Grid layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-slate-400">No scheduled events found</div>
        ) : (
          filteredEvents.map((evt) => (
            <div 
              key={evt.id} 
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 dark:border-slate-850 dark:bg-slate-900"
            >
              <button
                onClick={() => handleDelete(evt.id)}
                className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 opacity-0 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 transition-opacity dark:hover:bg-rose-950/20"
                title="Cancel Event"
              >
                <FaTrash className="h-3 w-3" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                  <FaCalendarDay />
                  <span>{evt.date} | {evt.time}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200 leading-snug">
                  {evt.title}
                </h3>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {evt.description || 'No description provided.'}
                </p>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 mt-4 flex flex-col gap-2 text-[10px] text-slate-400 font-medium">
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

      {/* Modal Add Event */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Schedule New Campus Event"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <InputField
            label="Event Title"
            id="title"
            placeholder="e.g. Annual Cultural Festival 'Aura'"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Date"
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
            <InputField
              label="Time Duration"
              id="time"
              placeholder="e.g. 10:00 AM - 05:00 PM"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Venue/Location"
              id="location"
              placeholder="e.g. Seminar Hall 1 or Open Air Theater"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <InputField
              label="Coordinator Faculty"
              id="coordinator"
              type="select"
              options={faculty.map(f => f.name)}
              value={formData.coordinator}
              onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
              required
            />
          </div>

          <InputField
            label="Description"
            id="description"
            type="textarea"
            placeholder="Outline schedule, criteria, prizes, or general details..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Publish Event
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Events;
