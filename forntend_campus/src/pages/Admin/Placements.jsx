import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBriefcase, FaPlus, FaCheckCircle, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Placements = () => {
  const api = useMockApi();
  const [placements, setPlacements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal Control
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedPlacement, setSelectedPlacement] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    company: '',
    designation: '',
    package: '',
    eligibility: '',
    driveDate: '',
    status: 'Upcoming',
    applied: 0,
    selected: 0
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('placements');
      setPlacements(list);
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
      company: '',
      designation: '',
      package: '12 LPA',
      eligibility: 'All Branches (CGPA > 7.0)',
      driveDate: '',
      status: 'Upcoming',
      applied: 0,
      selected: 0
    });
    setModalType('add');
    setModalOpen(true);
  };

  const handleOpenEdit = (plc) => {
    setSelectedPlacement(plc);
    setFormData({
      company: plc.company,
      designation: plc.designation,
      package: plc.package,
      eligibility: plc.eligibility,
      driveDate: plc.driveDate,
      status: plc.status,
      applied: plc.applied,
      selected: plc.selected
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this placement drive?')) {
      try {
        await api.deleteItem('placements', id);
        loadData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'add') {
        await api.createItem('placements', formData);
      } else {
        await api.updateItem('placements', selectedPlacement.id, formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Recruiting Company', accessor: 'company', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 font-bold dark:bg-slate-800 dark:text-indigo-400">
          <FaBriefcase className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-slate-850 dark:text-slate-200">{row.company}</p>
          <p className="text-[10px] text-slate-400">{row.designation}</p>
        </div>
      </div>
    )},
    { header: 'Package', accessor: 'package' },
    { header: 'Eligibility Criteria', accessor: 'eligibility' },
    { header: 'Drive Date', accessor: 'driveDate' },
    { header: 'Applied / Selected', accessor: 'applied', render: (row) => (
      <span className="text-[11px] font-semibold text-slate-650 dark:text-slate-400">
        {row.applied} Applied / <strong className="text-emerald-600 dark:text-emerald-400">{row.selected} Placed</strong>
      </span>
    )},
    { header: 'Status', accessor: 'status', render: (row) => {
      const upcoming = row.status === 'Upcoming';
      return (
        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
          upcoming 
            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' 
            : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
        }`}>
          {row.status}
        </span>
      );
    }}
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Placement Cell Board
          </h1>
          <p className="text-xs text-slate-400">
            Coordinate upcoming hiring drives, track packages, eligibility filters, and select students lists.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaPlus /> Post Placement Drive
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={placements}
          searchPlaceholder="Search recruiters..."
          searchKey="company"
          pageSize={6}
          actions={(row) => (
            <>
              <button 
                onClick={() => handleOpenEdit(row)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <FaEdit />
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

      {/* Modal Add/Edit */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalType === 'add' ? 'Post New Placement Drive' : 'Edit Placement Details'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Company Name"
              id="company"
              placeholder="e.g. NVIDIA"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <InputField
              label="Designation/Role"
              id="designation"
              placeholder="e.g. Hardware Engineer"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Salary Package"
              id="package"
              placeholder="e.g. 25 LPA"
              value={formData.package}
              onChange={(e) => setFormData({ ...formData, package: e.target.value })}
              required
            />
            <InputField
              label="Drive Date"
              id="driveDate"
              type="date"
              value={formData.driveDate}
              onChange={(e) => setFormData({ ...formData, driveDate: e.target.value })}
              required
            />
          </div>

          <InputField
            label="Eligibility Criteria"
            id="eligibility"
            placeholder="e.g. ECE, CSE (CGPA > 8.0)"
            value={formData.eligibility}
            onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
            required
          />

          <div className="grid grid-cols-3 gap-4">
            <InputField
              label="Applied Count"
              id="applied"
              type="number"
              value={formData.applied}
              onChange={(e) => setFormData({ ...formData, applied: Number(e.target.value) })}
              required
            />
            <InputField
              label="Placed Count"
              id="selected"
              type="number"
              value={formData.selected}
              onChange={(e) => setFormData({ ...formData, selected: Number(e.target.value) })}
              required
            />
            <InputField
              label="Drive Status"
              id="status"
              type="select"
              options={['Upcoming', 'Completed']}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Post Opportunities
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Placements;
