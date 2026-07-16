import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBuilding, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Departments = () => {
  const api = useMockApi();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedDept, setSelectedDept] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    head: '',
    room: '',
    facultyCount: 0,
    studentCount: 0
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('departments');
      setDepartments(list);
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
    setFormData({ name: '', code: '', head: '', room: '', facultyCount: 0, studentCount: 0 });
    setModalType('add');
    setModalOpen(true);
  };

  const handleOpenEdit = (dept) => {
    setSelectedDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      head: dept.head,
      room: dept.room,
      facultyCount: dept.facultyCount,
      studentCount: dept.studentCount
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this department? This action cannot be undone.')) {
      try {
        await api.deleteItem('departments', id);
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
        await api.createItem('departments', formData);
      } else {
        await api.updateItem('departments', selectedDept.id, formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Department Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 text-base dark:bg-slate-800 dark:text-indigo-400">
          <FaBuilding className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</p>
          <p className="text-[10px] text-slate-400">Code: {row.code}</p>
        </div>
      </div>
    )},
    { header: 'Head of Department', accessor: 'head' },
    { header: 'Location Block', accessor: 'room' },
    { header: 'Faculty count', accessor: 'facultyCount' },
    { header: 'Student count', accessor: 'studentCount' }
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Departments Manager
          </h1>
          <p className="text-xs text-slate-400">
            Configure individual campus department directories, locations, HOD chairs, and staff statistics.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaBuilding /> Add Department
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={departments}
          searchPlaceholder="Search by department name..."
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
        title={modalType === 'add' ? 'Add New Department' : 'Edit Department'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <InputField
            label="Department Name"
            id="name"
            placeholder="e.g. Computer Science & Engineering"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Department Code"
              id="code"
              placeholder="e.g. CSE"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <InputField
              label="Location/Room"
              id="room"
              placeholder="Block A - 401"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              required
            />
          </div>

          <InputField
            label="Head of Department (HOD)"
            id="head"
            placeholder="Dr. Alan Turing"
            value={formData.head}
            onChange={(e) => setFormData({ ...formData, head: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Faculty Strength"
              id="facultyCount"
              type="number"
              value={formData.facultyCount}
              onChange={(e) => setFormData({ ...formData, facultyCount: Number(e.target.value) })}
              required
            />
            <InputField
              label="Student Enrollment"
              id="studentCount"
              type="number"
              value={formData.studentCount}
              onChange={(e) => setFormData({ ...formData, studentCount: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {modalType === 'add' ? 'Create Department' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;
