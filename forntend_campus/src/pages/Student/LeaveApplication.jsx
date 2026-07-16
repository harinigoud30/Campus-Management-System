import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import { FaClipboardList, FaPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 8;
const STATUS_BADGE = {
  Pending:  'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  Rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
};
const EMPTY_FORM = { leaveType: 'Medical', fromDate: '', toDate: '', reason: '' };

const StudentLeaveApplication = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.id) setLeaves(mockDb.getLeavesByApplicant(user.id));
    setLoading(false);
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.fromDate) e.fromDate = 'Required';
    if (!form.toDate) e.toDate = 'Required';
    if (form.fromDate && form.toDate && form.toDate < form.fromDate) e.toDate = 'Must be after From date';
    if (!form.reason.trim()) e.reason = 'Reason is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const student = user?.details || mockDb.getCollection('students').find(s => s.id === user?.id);
    mockDb.applyLeave({
      applicantId: user.id,
      applicantName: user.name,
      applicantRole: 'student',
      rollNo: student?.rollNo || 'STU-000',
      department: student?.department || 'N/A',
      leaveType: form.leaveType,
      fromDate: form.fromDate,
      toDate: form.toDate,
      reason: form.reason,
    });
    setLeaves(mockDb.getLeavesByApplicant(user.id));
    toast.success('Application Submitted', 'Your leave application is pending admin approval.');
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const paginated = leaves.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getDays = (from, to) => {
    if (!from || !to) return '';
    const d = Math.ceil((new Date(to) - new Date(from)) / (1000 * 60 * 60 * 24)) + 1;
    return `${d} day${d !== 1 ? 's' : ''}`;
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Leave Application</h1>
          <p className="text-xs text-slate-400 mt-0.5">Apply for leave and track your request status.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
          <FaPlus /> Apply for Leave
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Total Applied', value: leaves.length }, { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length }, { label: 'Pending', value: leaves.filter(l => l.status === 'Pending').length }].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">My Applications</h3>
        </div>
        {paginated.length === 0 ? (
          <EmptyState icon={FaClipboardList} title="No applications yet" description="Submit your first leave application to get started." actionLabel="Apply for Leave" onAction={() => setShowModal(true)} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>{['Leave Type','From','To','Duration','Reason','Applied On','Status','Admin Remarks'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginated.map(leave => (
                    <tr key={leave.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{leave.leaveType}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{leave.fromDate}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{leave.toDate}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{getDays(leave.fromDate, leave.toDate)}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">{leave.reason}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{leave.appliedDate}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[leave.status]}`}>{leave.status}</span></td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs">{leave.remarks || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4"><Pagination currentPage={page} totalPages={Math.ceil(leaves.length / ITEMS_PER_PAGE)} onPageChange={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={leaves.length} /></div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">Apply for Leave</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Leave Type</label>
                <select value={form.leaveType} onChange={e => setForm({ ...form, leaveType: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  {['Medical', 'Personal', 'Academic', 'Emergency', 'Other'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">From Date *</label>
                  <input type="date" value={form.fromDate} onChange={e => setForm({ ...form, fromDate: e.target.value })} className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${errors.fromDate ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'}`} />
                  {errors.fromDate && <p className="text-xs text-rose-500 mt-1">{errors.fromDate}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">To Date *</label>
                  <input type="date" value={form.toDate} onChange={e => setForm({ ...form, toDate: e.target.value })} className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${errors.toDate ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'}`} />
                  {errors.toDate && <p className="text-xs text-rose-500 mt-1">{errors.toDate}</p>}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Reason for Leave *</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} rows={4} placeholder="Describe the reason for your leave request..." className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none ${errors.reason ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'}`} />
                {errors.reason && <p className="text-xs text-rose-500 mt-1">{errors.reason}</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setErrors({}); }} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Submit</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentLeaveApplication;
