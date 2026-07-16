import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useToast } from '../../context/ToastContext';
import Pagination from '../../components/Pagination/Pagination';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import EmptyState from '../../components/EmptyState/EmptyState';
import Loader from '../../components/Loader/Loader';
import { FaClipboardList, FaCheck, FaTimes, FaCommentAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 8;

const STATUS_BADGE = {
  Pending:  'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  Approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  Rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
};

const AdminLeaveRequests = () => {
  const toast = useToast();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [reviewModal, setReviewModal] = useState(null);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    setLeaves(mockDb.getCollection('leaveRequests'));
    setLoading(false);
  }, []);

  const filtered = leaves.filter(l => {
    const matchSearch = !search || l.applicantName.toLowerCase().includes(search.toLowerCase()) || l.rollNo.toLowerCase().includes(search.toLowerCase());
    const matchRole = !filterRole || l.applicantRole === filterRole;
    const matchStatus = !filterStatus || l.status === filterStatus;
    return matchSearch && matchRole && matchStatus;
  });
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleReview = (status) => {
    mockDb.reviewLeave(reviewModal.id, status, remarks);
    setLeaves(mockDb.getCollection('leaveRequests'));
    toast.success(status === 'Approved' ? 'Leave Approved' : 'Leave Rejected', `${reviewModal.applicantName}'s leave has been ${status.toLowerCase()}.`);
    setReviewModal(null);
    setRemarks('');
  };

  const stats = [
    { label: 'Total Requests', value: leaves.length },
    { label: 'Pending', value: leaves.filter(l => l.status === 'Pending').length },
    { label: 'Approved', value: leaves.filter(l => l.status === 'Approved').length },
    { label: 'Rejected', value: leaves.filter(l => l.status === 'Rejected').length },
  ];

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Leave Requests</h1>
        <p className="text-xs text-slate-400 mt-0.5">Review and approve or reject leave applications from students and faculty.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
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
            searchPlaceholder="Search by name or roll no..."
            filters={[
              { key: 'role', label: 'All Roles', options: [{ value: 'student', label: 'Student' }, { value: 'faculty', label: 'Faculty' }] },
              { key: 'status', label: 'All Status', options: ['Pending','Approved','Rejected'].map(s => ({ value: s, label: s })) }
            ]}
            filterValues={{ role: filterRole, status: filterStatus }}
            onFilterChange={(k, v) => { if (k === 'role') setFilterRole(v); else setFilterStatus(v); setPage(1); }}
            onClear={() => { setSearch(''); setFilterRole(''); setFilterStatus(''); }}
          />
        </div>
        {paginated.length === 0 ? <EmptyState icon={FaClipboardList} title="No leave requests" description="Leave applications will appear here." /> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>{['Applicant', 'Role', 'Leave Type', 'From', 'To', 'Applied On', 'Status', 'Remarks', 'Actions'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {paginated.map(leave => (
                    <tr key={leave.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{leave.applicantName}</div>
                        <div className="text-xs text-slate-400">{leave.rollNo} · {leave.department}</div>
                      </td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${leave.applicantRole === 'faculty' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400'}`}>{leave.applicantRole}</span></td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{leave.leaveType}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{leave.fromDate}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{leave.toDate}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{leave.appliedDate}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[leave.status]}`}>{leave.status}</span></td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400 text-xs max-w-[150px] truncate">{leave.remarks || '—'}</td>
                      <td className="px-4 py-3">
                        {leave.status === 'Pending' ? (
                          <button onClick={() => { setReviewModal(leave); setRemarks(''); }} className="flex items-center gap-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
                            <FaCommentAlt /> Review
                          </button>
                        ) : <span className="text-xs text-slate-400">Reviewed</span>}
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

      {reviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setReviewModal(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Review Leave Request</h2>
            <p className="text-xs text-slate-400 mb-5">From: <span className="font-semibold text-slate-600 dark:text-slate-300">{reviewModal.applicantName}</span> · {reviewModal.leaveType} Leave · {reviewModal.fromDate} to {reviewModal.toDate}</p>
            <div className="rounded-xl bg-slate-50 dark:bg-slate-800 p-3 mb-4">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Reason:</p>
              <p className="text-sm text-slate-700 dark:text-slate-300">{reviewModal.reason}</p>
            </div>
            <div className="mb-5">
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Admin Remarks (optional)</label>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3} placeholder="Add any remarks or instructions..." className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setReviewModal(null)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={() => handleReview('Rejected')} className="flex-1 rounded-xl bg-rose-100 dark:bg-rose-950/30 py-2.5 text-sm font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-200 transition-colors flex items-center justify-center gap-2"><FaTimes /> Reject</button>
              <button onClick={() => handleReview('Approved')} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"><FaCheck /> Approve</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminLeaveRequests;
