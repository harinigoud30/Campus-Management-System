import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarCheck, FaCheckCircle, FaUserCheck } from 'react-icons/fa';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Attendance = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [facultyDetails, setFacultyDetails] = useState(null);
  
  // Selection States
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  
  // Attendance Checklist state: { [studentId]: true/false (present/absent) }
  const [checklist, setChecklist] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const loadFacultyDetails = async () => {
      try {
        const name = user?.name || 'Dr. Grace Hopper';
        const list = await api.getCollection('faculty');
        const details = list.find(f => f.name === name) || list[1];
        setFacultyDetails(details);
        
        if (details.courses && details.courses.length > 0) {
          setSelectedCourse(details.courses[0]);
        }
        if (details.subjects && details.subjects.length > 0) {
          setSelectedSubject(details.subjects[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadFacultyDetails();
    }
  }, [user, api]);

  // Load students when selected course changes
  useEffect(() => {
    const loadCourseStudents = async () => {
      if (!selectedCourse) return;
      try {
        const stuList = await api.getCollection('students');
        const enrolled = stuList.filter(s => s.course === selectedCourse);
        setStudents(enrolled);
        
        // Default checklist: all present
        const initialChecklist = {};
        enrolled.forEach(s => {
          initialChecklist[s.id] = true;
        });
        setChecklist(initialChecklist);
      } catch (e) {
        console.error(e);
      }
    };
    loadCourseStudents();
  }, [selectedCourse, api]);

  const handleToggleStudent = (studentId) => {
    setChecklist(prev => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleSelectAll = (status) => {
    const updated = {};
    students.forEach(s => {
      updated[s.id] = status;
    });
    setChecklist(updated);
  };

  const handleSubmitAttendance = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMsg('');
    try {
      // Loop through checklist and post attendance adjustments
      for (const student of students) {
        const isPresent = checklist[student.id];
        // Calculate new attendance percentage mock update in student collection
        const classesAttendedInc = isPresent ? 1 : 0;
        
        // Perform simulated background update
        await api.updateStudentAttendance(student.id, selectedSubject, classesAttendedInc, 1);
        
        // Also update standard average attendance field on student record
        const attList = await api.getStudentAttendance(student.id);
        const subjectAtt = attList.find(a => a.subject === selectedSubject);
        if (subjectAtt) {
          const totalConducted = subjectAtt.classesConducted;
          const totalAttended = subjectAtt.classesAttended;
          const newPercentage = Math.round((totalAttended / totalConducted) * 100 * 10) / 10;
          
          await api.updateItem('students', student.id, {
            attendance: newPercentage
          });
        }
      }
      
      setSuccessMsg('Attendance logs successfully recorded!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Daily Attendance Marking
          </h1>
          <p className="text-xs text-slate-400">
            Mark daily course attendance checklists and register student counts.
          </p>
        </div>
      </div>

      {/* Select selectors row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 bg-white p-5 rounded-2xl border border-slate-100 dark:border-slate-850 dark:bg-slate-900 shadow-xs">
        <div>
          <label className="block text-[10px] font-semibold text-slate-450 uppercase mb-1">Degree Program</label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {facultyDetails?.courses.map((c, idx) => (
              <option key={idx} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-semibold text-slate-450 uppercase mb-1">Subject Module</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 px-3 text-xs outline-hidden dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200"
          >
            {facultyDetails?.subjects.map((s, idx) => (
              <option key={idx} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance checklist list */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-805">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Student Attendance Roster
          </h3>
          <div className="flex gap-2 text-[10px] font-semibold">
            <button 
              onClick={() => handleSelectAll(true)}
              className="text-indigo-650 hover:underline dark:text-indigo-400"
            >
              Select All Present
            </button>
            <span className="text-slate-300">|</span>
            <button 
              onClick={() => handleSelectAll(false)}
              className="text-slate-450 hover:underline hover:text-slate-600 dark:hover:text-slate-350"
            >
              Select All Absent
            </button>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-xs text-slate-400 py-8 text-center">No students registered in this course program</p>
        ) : (
          <form onSubmit={handleSubmitAttendance} className="space-y-6">
            <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-[450px] overflow-y-auto pr-2">
              {students.map((student) => (
                <div 
                  key={student.id} 
                  className="flex items-center justify-between py-3 hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-xs text-slate-850 dark:text-slate-200">{student.name}</h4>
                    <p className="text-[9px] text-slate-400">Roll ID: {student.rollNo}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    {/* Display current cumulative attendance */}
                    <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                      Current average: {student.attendance}%
                    </span>

                    {/* Radio Button Options */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setChecklist(prev => ({ ...prev, [student.id]: true }))}
                        className={`rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-all ${
                          checklist[student.id] === true
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                            : 'border border-slate-100 text-slate-400 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => setChecklist(prev => ({ ...prev, [student.id]: false }))}
                        className={`rounded-xl px-3 py-1.5 text-[10px] font-semibold transition-all ${
                          checklist[student.id] === false
                            ? 'bg-rose-50 text-rose-600 border border-rose-205 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30'
                            : 'border border-slate-100 text-slate-400 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                        }`}
                      >
                        Absent
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {successMsg && (
              <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-650 dark:text-emerald-400">
                <FaCheckCircle /> {successMsg}
              </p>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button 
                type="submit" 
                variant="primary" 
                loading={submitting}
                className="flex items-center gap-1.5"
              >
                <FaUserCheck /> Submit Attendance Logs
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Attendance;
