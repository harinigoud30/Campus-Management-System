import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Faculty = () => {
  const api = useMockApi();
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // add, edit
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    facultyId: '',
    designation: '',
    department: '',
    office: '',
    qualification: '',
    experience: '',
    status: 'Active'
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('faculty');
      const deptList = await api.getCollection('departments');
      setFaculty(list);
      setDepartments(deptList);
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
      name: '',
      email: '',
      facultyId: '',
      designation: 'Assistant Professor',
      department: departments[0]?.name || '',
      office: '',
      qualification: '',
      experience: '',
      status: 'Active'
    });
    setModalType('add');
    setModalOpen(true);
  };

  const handleOpenEdit = (fac) => {
    setSelectedFaculty(fac);
    setFormData({
      name: fac.name,
      email: fac.email,
      facultyId: fac.facultyId,
      designation: fac.designation,
      department: fac.department,
      office: fac.office,
      qualification: fac.qualification,
      experience: fac.experience,
      status: fac.status
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty record?')) {
      try {
        await api.deleteItem('faculty', id);
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
        await api.createItem('faculty', formData);
      } else {
        await api.updateItem('faculty', selectedFaculty.id, formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Faculty Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 font-bold dark:bg-slate-800 dark:text-indigo-400">
          {row.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</p>
          <p className="text-[10px] text-slate-400">{row.email}</p>
        </div>
      </div>
    )},
    { header: 'Faculty ID', accessor: 'facultyId' },
    { header: 'Designation', accessor: 'designation' },
    { header: 'Department', accessor: 'department' },
    { header: 'Office Block', accessor: 'office' },
    { header: 'Status', accessor: 'status', render: (row) => {
      const active = row.status === 'Active';
      return (
        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
          active 
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
            : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400'
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
            Faculty Directory
          </h1>
          <p className="text-xs text-slate-400">
            Monitor and manage faculty registrations, departments assignment, qualifications records, and offices.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaUserPlus /> Add Faculty Member
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={faculty}
          searchPlaceholder="Search by faculty name..."
          searchKey="name"
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
        title={modalType === 'add' ? 'Add New Faculty Member' : 'Edit Faculty Member'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            id="name"
            placeholder="Dr. Alan Turing"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="alan.turing@campus.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Faculty ID"
              id="facultyId"
              placeholder="FAC-CSE-001"
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              required
            />
            <InputField
              label="Office room"
              id="office"
              placeholder="Block A - 401"
              value={formData.office}
              onChange={(e) => setFormData({ ...formData, office: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Department"
              id="department"
              type="select"
              options={departments.map(d => d.name)}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <InputField
              label="Designation"
              id="designation"
              type="select"
              options={['Professor & Head', 'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer']}
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Highest Qualification"
              id="qualification"
              placeholder="Ph.D. in Computer Science"
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              required
            />
            <InputField
              label="Teaching Experience"
              id="experience"
              placeholder="e.g. 10 Years"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              required
            />
          </div>

          <InputField
            label="Status"
            id="status"
            type="select"
            options={['Active', 'On Leave', 'Retired']}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {modalType === 'add' ? 'Add Member' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Faculty;
