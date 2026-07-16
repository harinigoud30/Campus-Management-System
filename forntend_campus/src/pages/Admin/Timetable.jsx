import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarAlt, FaPlus, FaTrash } from 'react-icons/fa';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Timetable = () => {
  const api = useMockApi();
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('B.Tech Computer Science');
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    day: 'Monday',
    time: '09:00 - 10:00',
    subject: '',
    code: '',
    room: '',
    teacher: ''
  });

  const loadData = async () => {
    try {
      const crsList = await api.getCollection('courses');
      const subList = await api.getCollection('subjects');
      const facList = await api.getCollection('faculty');
      const schedule = await api.getTimetable(selectedCourse);
      
      setCourses(crsList);
      setSubjects(subList);
      setFaculty(facList);
      setTimetable(schedule);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [selectedCourse]);

  const handleOpenAdd = () => {
    setFormData({
      day: 'Monday',
      time: '09:00 - 10:00',
      subject: subjects[0]?.name || '',
      code: subjects[0]?.code || '',
      room: 'Block A - 402',
      teacher: faculty[0]?.name || ''
    });
    setModalOpen(true);
  };

  const handleSubjectChange = (e) => {
    const subName = e.target.value;
    const foundSub = subjects.find(s => s.name === subName);
    setFormData({
      ...formData,
      subject: subName,
      code: foundSub ? foundSub.code : ''
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const updatedTimetable = { ...timetable };
    const daySlots = updatedTimetable[formData.day] || [];
    
    // Add new slot
    daySlots.push({
      time: formData.time,
      subject: formData.subject,
      code: formData.code,
      room: formData.room,
      teacher: formData.teacher
    });
    
    updatedTimetable[formData.day] = daySlots;
    
    try {
      await api.updateTimetable(selectedCourse, updatedTimetable);
      setTimetable(updatedTimetable);
      setModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSlot = async (day, index) => {
    if (window.confirm('Remove this schedule slot?')) {
      const updatedTimetable = { ...timetable };
      updatedTimetable[day].splice(index, 1);
      
      try {
        await api.updateTimetable(selectedCourse, updatedTimetable);
        setTimetable(updatedTimetable);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  if (loading && courses.length === 0) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Weekly Class Scheduler
          </h1>
          <p className="text-xs text-slate-400">
            Design and review academic timetables, lecture slot room allocations, and faculty assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Select Course */}
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            {courses.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <Button 
            onClick={handleOpenAdd}
            variant="primary"
            className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
          >
            <FaPlus /> Add Class Slot
          </Button>
        </div>
      </div>

      {/* Scheduler Grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {daysOfWeek.map(day => {
          const slots = timetable[day] || [];
          return (
            <div key={day} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-xs dark:border-slate-850 dark:bg-slate-900 flex flex-col min-h-[350px]">
              <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 border-b border-slate-150 pb-3 mb-4 flex justify-between items-center tracking-wider uppercase">
                <span>{day}</span>
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400">
                  {slots.length} Classes
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
                      className="group relative rounded-xl border border-slate-100 bg-slate-50/40 p-3 hover:bg-slate-50 transition-colors dark:border-slate-800/80 dark:bg-slate-800/20 dark:hover:bg-slate-800/50"
                    >
                      <button 
                        onClick={() => handleDeleteSlot(day, idx)}
                        className="absolute top-2 right-2 rounded-md p-1 text-slate-400 opacity-0 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 transition-opacity dark:hover:bg-rose-950/20"
                        title="Delete slot"
                      >
                        <FaTrash className="h-2.5 w-2.5" />
                      </button>
                      <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {slot.time}
                      </p>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-slate-200 leading-snug mt-1">
                        {slot.subject}
                      </h4>
                      <p className="text-[9px] text-slate-400 mt-1 font-medium">
                        Instructor: {slot.teacher}
                      </p>
                      <p className="text-[9px] text-slate-400 font-medium">
                        Venue: {slot.room}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Add Class to Timetable`}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Target Day"
              id="day"
              type="select"
              options={daysOfWeek}
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              required
            />
            <InputField
              label="Time Slot"
              id="time"
              placeholder="e.g. 09:00 - 10:00"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Select Subject"
              id="subject"
              type="select"
              options={subjects.map(s => s.name)}
              value={formData.subject}
              onChange={handleSubjectChange}
              required
            />
            <InputField
              label="Subject Code"
              id="code"
              value={formData.code}
              disabled
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Lecture Room/Lab"
              id="room"
              placeholder="Block A - 402"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              required
            />
            <InputField
              label="Assign Faculty"
              id="teacher"
              type="select"
              options={faculty.map(f => f.name)}
              value={formData.teacher}
              onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Schedule Class
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;
