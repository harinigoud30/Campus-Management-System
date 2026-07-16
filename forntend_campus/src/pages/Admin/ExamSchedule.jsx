import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';
import EmptyState from '../../components/EmptyState/EmptyState';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import Loader from '../../components/Loader/Loader';
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 8;
const EMPTY_FORM = { examType: 'End Semester', course: 'B.Tech Computer Science', semester: 5, subject: '', subjectCode: '', date: '', time: '', hall: '', maxMarks: 100, duration: '3 Hours', invigilator: '' };

const AdminExamSchedule = () => {
  const toast = useToast();
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    setExams(mockDb.getCollection('examSchedule'));
    setCourses(mockDb.getCollection('courses'));
    setFaculty(mockDb.getCollection('faculty'));
    setLoading(false);
  }, []);

  const filtered = exams.filter(e => {
    const matchSearch = !search || e.subject.toLowerCase().includes(search.toLowerCase()) || e.subjectCode.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || e.examType === filterType;
    const matchCourse = !filterCourse || e.course === filterCourse;
    return matchSearch && matchType && matchCourse;
  });
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleSave = () => {
    if (!form.subject || !form.date || !form.hall) return toast.error('Validation', 'Subject, date and hall are required.');
    if (editingExam) {
      mockDb.updateItem('examSchedule', editingExam.id, form);
      toast.success('Updated', `Exam schedule for "${form.subject}" updated.`);
    } else {
      mockDb.createItem('examSchedule', form);
      toast.success('Added', `Exam scheduled for "${form.subject}".`);
    }
    setExams(mockDb.getCollection('examSchedule'));
    setShowModal(false);
    setEditingExam(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = () => {
    mockDb.deleteItem('examSchedule', deleteConfirm.id);
    setExams(mockDb.getCollection('examSchedule'));
    toast.success('Deleted', 'Exam entry removed from schedule.');
    setDeleteConfirm(null);
  };

  const openEdit = (exam) => {
    setEditingExam(exam);
    setForm({ examType: exam.examType, course: exam.course, semester: exam.semester, subject: exam.subject, subjectCode: exam.subjectCode, date: exam.date, time: exam.time, hall: exam.hall, maxMarks: exam.maxMarks, duration: exam.duration, invigilator: exam.invigilator });
    setShowModal(true);
  };

  const typeColor = { 'End Semester': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400', 'Mid Semester': 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', 'Internal': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Exam Schedule</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage and publish examination timetables for all courses.</p>
        </div>
        <button onClick={() => { setEditingExam(null); setForm(EMPTY_FORM); setShowModal(true); }} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
          <FaPlus /> Schedule Exam
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Exams', value: exams.length }, { label: 'End Semester', value: exams.filter(e => e.examType === 'End Semester').length }, { label: 'Mid Semester', value: exams.filter(e => e.examType === 'Mid Semester').length }].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <SearchFilter
            searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
            searchPlaceholder="Search subject or code..."
            filters={[
              { key: 'type', label: 'All Exam Types', options: ['End Semester','Mid Semester','Internal'].map(t => ({ value: t, label: t })) },
              { key: 'course', label: 'All Courses', options: courses.map(c => ({ value: c.name, label: c.name })) }
            ]}
            filterValues={{ type: filterType, course: filterCourse }}
            onFilterChange={(k, v) => { if (k === 'type') setFilterType(v); else setFilterCourse(v); setPage(1); }}
            onClear={() => { setSearch(''); setFilterType(''); setFilterCourse(''); }}
          />
        </div>
        {paginated.length === 0 ? <EmptyState icon={FaCalendarAlt} title="No exams scheduled" description="Add exam entries to build the timetable." actionLabel="Schedule Exam" onAction={() => setShowModal(true)} /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>{['Subject', 'Course / Sem', 'Date', 'Time', 'Hall', 'Marks', 'Type', 'Invigilator', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginated.map(exam => (
                    <tr key={exam.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{exam.subject}</div>
                        <div className="text-xs text-slate-400">{exam.subjectCode}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{exam.course}<br />Sem {exam.semester}</td>
                      <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">{exam.date}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap text-xs"><FaClock className="inline mr-1 text-slate-400" />{exam.time}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs"><FaMapMarkerAlt className="inline mr-1 text-slate-400" />{exam.hall}</td>
                      <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">{exam.maxMarks}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${typeColor[exam.examType] || ''}`}>{exam.examType}</span></td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{exam.invigilator}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(exam)} className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"><FaEdit /></button>
                          <button onClick={() => setDeleteConfirm(exam)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"><FaTrash /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4"><Pagination currentPage={page} totalPages={Math.ceil(filtered.length / ITEMS_PER_PAGE)} onPageChange={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={filtered.length} /></div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">{editingExam ? 'Edit Exam' : 'Schedule New Exam'}</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Exam Type', key: 'examType', type: 'select', options: ['End Semester','Mid Semester','Internal','Practical'] },
                { label: 'Course', key: 'course', type: 'select', options: courses.map(c => c.name) },
                { label: 'Semester', key: 'semester', type: 'number' },
                { label: 'Subject *', key: 'subject', type: 'text', placeholder: 'e.g. Data Structures' },
                { label: 'Subject Code', key: 'subjectCode', type: 'text', placeholder: 'e.g. CSE-301' },
                { label: 'Date *', key: 'date', type: 'date' },
                { label: 'Time', key: 'time', type: 'text', placeholder: '09:00 AM - 12:00 PM' },
                { label: 'Exam Hall *', key: 'hall', type: 'text', placeholder: 'Exam Hall A' },
                { label: 'Max Marks', key: 'maxMarks', type: 'number' },
                { label: 'Duration', key: 'duration', type: 'text', placeholder: '3 Hours' },
              ].map(f => (
                <div key={f.key} className={f.key === 'subject' ? 'col-span-2' : ''}>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                      {f.options.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} value={form[f.key]} placeholder={f.placeholder || ''} onChange={e => setForm({ ...form, [f.key]: f.type === 'number' ? +e.target.value : e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" />
                  )}
                </div>
              ))}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Invigilator</label>
                <select value={form.invigilator} onChange={e => setForm({ ...form, invigilator: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  <option value="">-- Select Invigilator --</option>
                  {faculty.map(f => <option key={f.id}>{f.name}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">{editingExam ? 'Update' : 'Schedule'}</button>
            </div>
          </motion.div>
        </div>
      )}
      <ConfirmDialog isOpen={!!deleteConfirm} title="Remove Exam?" message={`Delete "${deleteConfirm?.subject}" from the exam schedule?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
};

export default AdminExamSchedule;
