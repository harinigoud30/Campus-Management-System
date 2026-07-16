import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import { FaCertificate, FaPlus, FaDownload, FaCheckCircle, FaHourglassHalf, FaBoxOpen } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

const STATUS_INFO = {
  Pending: { badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400', icon: <FaHourglassHalf className="text-amber-500" /> },
  Processing: { badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400', icon: <FaHourglassHalf className="text-blue-500" /> },
  'Ready for Collection': { badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', icon: <FaCheckCircle className="text-emerald-500" /> },
  Collected: { badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400', icon: <FaCheckCircle className="text-slate-400" /> },
};

const CERT_TYPES = ['Bonafide Certificate', 'Character Certificate', 'Transcript', 'Course Completion Certificate', 'Migration Certificate', 'No Dues Certificate'];

const EMPTY_FORM = { type: 'Bonafide Certificate', purpose: '' };

const StudentCertificate = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user?.id) setCerts(mockDb.getStudentCertificates(user.id));
    setLoading(false);
  }, [user]);

  const validate = () => {
    const e = {};
    if (!form.purpose.trim()) e.purpose = 'Purpose is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const student = user?.details || mockDb.getCollection('students').find(s => s.id === user?.id);
    const alreadyPending = certs.find(c => c.type === form.type && c.status === 'Pending');
    if (alreadyPending) return toast.warning('Duplicate Request', `You already have a pending request for "${form.type}".`);
    mockDb.requestCertificate({
      studentId: user.id,
      studentName: user.name,
      rollNo: student?.rollNo || 'STU-000',
      type: form.type,
      purpose: form.purpose,
    });
    setCerts(mockDb.getStudentCertificates(user.id));
    toast.success('Request Submitted', `Your request for "${form.type}" has been submitted. Processing time: 2–3 working days.`);
    setShowModal(false);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const paginated = certs.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Certificate Requests</h1>
          <p className="text-xs text-slate-400 mt-0.5">Request official certificates and track their status.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
          <FaPlus /> Request Certificate
        </button>
      </div>

      {/* Available Cert Types */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 p-6 text-white">
        <h3 className="font-semibold text-sm mb-3 opacity-80">Available Certificates</h3>
        <div className="flex flex-wrap gap-2">
          {CERT_TYPES.map(c => (
            <button key={c} onClick={() => { setForm({ type: c, purpose: '' }); setShowModal(true); }} className="rounded-xl bg-white/20 px-3 py-1.5 text-xs font-semibold hover:bg-white/30 transition-colors">
              {c}
            </button>
          ))}
        </div>
        <p className="text-xs opacity-60 mt-3">* Processing time: 2–3 working days after submission. Collect from Admin Office with your ID card.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Requested', value: certs.length },
          { label: 'Ready / Collected', value: certs.filter(c => ['Ready for Collection','Collected'].includes(c.status)).length },
          { label: 'Pending', value: certs.filter(c => c.status === 'Pending').length },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Certificate Cards */}
      {paginated.length === 0 ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
          <EmptyState icon={FaCertificate} title="No certificates requested" description="Click 'Request Certificate' to submit your first request." actionLabel="Request Certificate" onAction={() => setShowModal(true)} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginated.map(cert => {
            const si = STATUS_INFO[cert.status] || STATUS_INFO.Pending;
            return (
              <motion.div key={cert.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 flex items-center justify-center shrink-0">
                    <FaCertificate className="text-indigo-500" />
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${si.badge}`}>{cert.status}</span>
                </div>
                <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 mb-1">{cert.type}</h4>
                <p className="text-xs text-slate-400 mb-3">Purpose: {cert.purpose}</p>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Requested: <span className="text-slate-600 dark:text-slate-300">{cert.requestedDate}</span></div>
                  {cert.collectedDate && <div>Collected: <span className="text-slate-600 dark:text-slate-300">{cert.collectedDate}</span></div>}
                </div>
                {cert.remarks && (
                  <div className={`mt-3 rounded-xl p-3 text-xs ${cert.status === 'Ready for Collection' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                    {cert.remarks}
                  </div>
                )}
                {cert.status === 'Ready for Collection' && (
                  <button className="mt-3 w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors">
                    <FaDownload /> Download / Acknowledge
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
      <Pagination currentPage={page} totalPages={Math.ceil(certs.length / ITEMS_PER_PAGE)} onPageChange={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={certs.length} />

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">Request a Certificate</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Certificate Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  {CERT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Purpose *</label>
                <input value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} placeholder="e.g. Bank loan, Job application, Visa..." className={`w-full rounded-xl border px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${errors.purpose ? 'border-rose-400' : 'border-slate-200 dark:border-slate-700'}`} />
                {errors.purpose && <p className="text-xs text-rose-500 mt-1">{errors.purpose}</p>}
              </div>
              <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 p-3 text-xs text-indigo-700 dark:text-indigo-400">
                <strong>Note:</strong> Processing time is 2–3 working days. You will need to collect the certificate from the Admin Office with your student ID.
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setErrors({}); }} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Submit Request</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StudentCertificate;
