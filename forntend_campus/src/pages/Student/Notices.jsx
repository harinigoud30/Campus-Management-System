import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBullhorn, FaEye } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Notices = () => {
  const api = useMockApi();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // View modal controls
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const list = await api.getCollection('notices');
        // Filter targeted for students
        const filtered = list.filter(n => n.target === 'All' || n.target === 'Student');
        setNotices(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [api]);

  const handleOpenNotice = (notice) => {
    setSelectedNotice(notice);
    setViewOpen(true);
  };

  const columns = [
    { header: 'Subject / Circular Title', accessor: 'title', render: (row) => (
      <p className="font-semibold text-slate-850 dark:text-slate-200">{row.title}</p>
    )},
    { header: 'Classification', accessor: 'category', render: (row) => (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-650 dark:bg-slate-850 dark:text-slate-400">
        {row.category}
      </span>
    )},
    { header: 'Broadcast Date', accessor: 'date' }
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Campus Circulars Board
        </h1>
        <p className="text-xs text-slate-400">
          Official notifications, syllabus modifications, exam schedules, and holiday broadcasts.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-855 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={notices}
          searchPlaceholder="Search notices board..."
          searchKey="title"
          pageSize={6}
          actions={(row) => (
            <button 
              onClick={() => handleOpenNotice(row)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-605 dark:hover:bg-slate-800 dark:hover:text-indigo-405 flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400"
            >
              <FaEye /> View Notice
            </button>
          )}
        />
      </div>

      {/* View Notice Detail modal */}
      <Modal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title={selectedNotice?.title}
      >
        <div className="space-y-4 text-xs font-semibold">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-805/40 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 uppercase">Category: {selectedNotice?.category}</span>
            <span className="text-[10px] text-slate-400 uppercase">Target: Students</span>
          </div>
          <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
            {selectedNotice?.content}
          </p>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400">
            <span>Released: {selectedNotice?.date}</span>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close Circular</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notices;
