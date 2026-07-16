import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import { FaExclamationCircle, FaPlus, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 6;
const STATUS_BADGE = {
  Pending:       'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  'Under Review':'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  Resolved:      'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  Closed:        'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};
const EMPTY_FORM = { category: 'Academic', subject: '', description: '' };

const StudentGrievance = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.id) setGrievances(mockDb.getStudentGrievances(user.id));
    setLoading(false);
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.subject.trim()) e.subject = 'Subject is required.';
    if (!form.description.trim()) e.description = 'Description is required.';
    if (form.description.trim().length < 20) e.description = 'Please provide more details (at least 20 characters).';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const student = user?.details || mockDb.getCollection('students').find(s => s.id === user?.id);
    mockDb.fileGrievance({
      studentId: user.id,
      studentName: user.name,
      rollNo: student?.rollNo || 'STU-000',
      category: form.category,
      subject: form.subject,
      description: form.description,
    });
    setGrievances(mockDb.getStudentGrievances(user.id));
    toast.success('Grievance Filed', 'Your grievance has been submitted and will be reviewed by admin.');
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const paginated = grievances.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const StatusIcon = ({ status }) => {
    if (status === 'Resolved') return <FaCheckCircle className="text-emerald-500" />;
    if (status === 'Under Review') return <FaHourglassHalf className="text-blue-500" />;
    return <FaExclamationCircle className="text-amber-500" />;
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Grievance & Complaints</h1>
          <p className="text-xs text-slate-400 mt-0.5">Submit and track your complaints and grievances.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
          <FaPlus /> File Grievance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Filed', value: grievances.length },
          { label: 'Resolved', value: grievances.filter(g => g.status === 'Resolved').length },
          { label: 'Pending / Review', value: grievances.filter(g => g.status !== 'Resolved').length },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Grievance Cards */}
      {paginated.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <EmptyState icon={FaExclamationCircle} title="No grievances filed" description="Submit a grievance if you have any issues or complaints." actionLabel="File Grievance" onAction={() => setShowModal(true)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {paginated.map(g => (
            <motion.div key={g.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-start gap-2 flex-1">
                  <StatusIcon status={g.status} />
                  <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight">{g.subject}</h3>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold shrink-0 ${STATUS_BADGE[g.status] || ''}`}>{g.status}</span>
              </div>
              <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">{g.category}</span>
              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">{g.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Filed: {g.filedDate}</span>
                {g.resolvedDate && <span>Resolved: {g.resolvedDate}</span>}
                <button onClick={() => setViewItem(g)} className="text-indigo-500 hover:underline font-medium">View Details</button>
              </div>
              {g.response && (
                <div className="mt-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-3">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Admin Response:</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">{g.response}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      <Pagination currentPage={page} totalPages={Math.ceil(grievances.length / ITEMS_PER_PAGE)} onPageChange={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={grievances.length} />

      {/* File Grievance Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">File a Grievance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  {['Academic', 'Hostel', 'Fees', 'Faculty', 'Administration', 'Infrastructure', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Subject *</label>
                <input value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} placeholder="Brief title of your grievance" className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${errors.subject ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'}`} />
                {errors.subject && <p className="text-xs text-rose-500 mt-1">{errors.subject}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Description *</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={5} placeholder="Describe your issue in detail. Include dates, people involved, and any relevant information..." className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none ${errors.description ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'}`} />
                {errors.description && <p className="text-xs text-rose-500 mt-1">{errors.description}</p>}
                <p className="text-xs text-slate-400 mt-1">{form.description.length} characters</p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setErrors({}); }} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Submit Grievance</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setViewItem(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Grievance Details</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[viewItem.status] || ''}`}>{viewItem.status}</span>
            </div>
            <div className="space-y-4">
              <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Category</p><p className="text-sm text-slate-700 dark:text-slate-300">{viewItem.category}</p></div>
              <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Subject</p><p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{viewItem.subject}</p></div>
              <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Description</p><p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{viewItem.description}</p></div>
              <div className="flex gap-4">
                <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Filed</p><p className="text-sm text-slate-700 dark:text-slate-300">{viewItem.filedDate}</p></div>
                {viewItem.resolvedDate && <div><p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resolved</p><p className="text-sm text-slate-700 dark:text-slate-300">{viewItem.resolvedDate}</p></div>}
              </div>
              {viewItem.response && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-4">
                  <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Admin Response</p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">{viewItem.response}</p>
                </div>
              )}
            </div>
            <button onClick={() => setViewItem(null)} className="mt-5 w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Close</button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentGrievance;
