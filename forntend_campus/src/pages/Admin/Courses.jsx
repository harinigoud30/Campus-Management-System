import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaGraduationCap, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Courses = () => {
  const api = useMockApi();
  const [courses, setCourses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    duration: '',
    department: '',
    feesPerSem: 0
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('courses');
      const deptList = await api.getCollection('departments');
      setCourses(list);
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
      code: '',
      duration: '4 Years',
      department: departments[0]?.name || '',
      feesPerSem: 75000
    });
    setModalType('add');
    setModalOpen(true);
  };

  const handleOpenEdit = (crs) => {
    setSelectedCourse(crs);
    setFormData({
      name: crs.name,
      code: crs.code,
      duration: crs.duration,
      department: crs.department,
      feesPerSem: crs.feesPerSem
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this course? All associated timetables and fee logs will remain in database but course link will be severed.')) {
      try {
        await api.deleteItem('courses', id);
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
        await api.createItem('courses', formData);
      } else {
        await api.updateItem('courses', selectedCourse.id, formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Course Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 text-base dark:bg-slate-800 dark:text-indigo-400">
          <FaGraduationCap className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</p>
          <p className="text-[10px] text-slate-400">Code: {row.code}</p>
        </div>
      </div>
    )},
    { header: 'Duration', accessor: 'duration' },
    { header: 'Affiliated Department', accessor: 'department' },
    { header: 'Fees Per Semester', accessor: 'feesPerSem', render: (row) => (
      <span className="font-bold text-slate-800 dark:text-slate-200">
        ${row.feesPerSem.toLocaleString()}
      </span>
    )}
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Active Degree Programs
          </h1>
          <p className="text-xs text-slate-400">
            Manage degree registrations, semester divisions, parent departments, and fee matrix setups.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaGraduationCap /> Add Course
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={courses}
          searchPlaceholder="Search by course name..."
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
        title={modalType === 'add' ? 'Add New Course Program' : 'Edit Course Program'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <InputField
            label="Course Name"
            id="name"
            placeholder="e.g. B.Tech Computer Science"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Course Code"
              id="code"
              placeholder="e.g. CS-BTECH"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <InputField
              label="Duration"
              id="duration"
              placeholder="e.g. 4 Years"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Affiliated Department"
              id="department"
              type="select"
              options={departments.map(d => d.name)}
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              required
            />
            <InputField
              label="Tuition Fees / Sem"
              id="feesPerSem"
              type="number"
              value={formData.feesPerSem}
              onChange={(e) => setFormData({ ...formData, feesPerSem: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {modalType === 'add' ? 'Create Program' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Courses;
