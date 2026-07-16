import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBullhorn, FaPlus, FaTrash, FaEye } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Notices = () => {
  const api = useMockApi();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Academic',
    target: 'All'
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('notices');
      setNotices(list);
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
      content: '',
      category: 'Academic',
      target: 'All'
    });
    setModalOpen(true);
  };

  const handleView = (notice) => {
    setSelectedNotice(notice);
    setViewOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this broadcast notification?')) {
      try {
        await api.deleteItem('notices', id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createItem('notices', {
        ...formData,
        date: new Date().toISOString().split('T')[0]
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Title / Subject', accessor: 'title', render: (row) => (
      <p className="font-semibold text-slate-850 dark:text-slate-200">{row.title}</p>
    )},
    { header: 'Category', accessor: 'category', render: (row) => (
      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-650 dark:bg-slate-850 dark:text-slate-400">
        {row.category}
      </span>
    )},
    { header: 'Target Audience', accessor: 'target', render: (row) => (
      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[9px] font-bold text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400">
        {row.target}
      </span>
    )},
    { header: 'Release Date', accessor: 'date' }
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Notice Broadcast Center
          </h1>
          <p className="text-xs text-slate-400">
            Broadcast official circulars, exam notifications, and campus news streams.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaPlus /> Create Announcement
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={notices}
          searchPlaceholder="Search announcements..."
          searchKey="title"
          pageSize={6}
          actions={(row) => (
            <>
              <button 
                onClick={() => handleView(row)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <FaEye />
              </button>
              <button 
                onClick={() => handleDelete(row.id)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-150 hover:text-rose-600 dark:hover:bg-slate-800 dark:hover:text-rose-400"
              >
                <FaTrash />
              </button>
            </>
          )}
        />
      </div>

      {/* Broadcast Notice Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Broadcast Announcement"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <InputField
            label="Notice Title / Subject"
            id="title"
            placeholder="e.g. Autumn Semester Project Review Timeline"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Broadcast Category"
              id="category"
              type="select"
              options={['Academic', 'Exam', 'Placement', 'Event', 'Facility']}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />
            <InputField
              label="Target Audience"
              id="target"
              type="select"
              options={['All', 'Student', 'Faculty']}
              value={formData.target}
              onChange={(e) => setFormData({ ...formData, target: e.target.value })}
              required
            />
          </div>

          <InputField
            label="Announcement Message"
            id="content"
            type="textarea"
            placeholder="Details, dates, instructions, or criteria details..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Broadcast Notice
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Notice modal */}
      <Modal
        isOpen={viewOpen}
        onClose={() => setViewOpen(false)}
        title={selectedNotice?.title}
      >
        <div className="space-y-4 text-xs">
          <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Category: {selectedNotice?.category}</span>
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Target: {selectedNotice?.target}</span>
          </div>
          <p className="text-slate-655 text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {selectedNotice?.content}
          </p>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400">
            <span>Broadcast Date: {selectedNotice?.date}</span>
            <Button variant="secondary" onClick={() => setViewOpen(false)}>Close View</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Notices;
