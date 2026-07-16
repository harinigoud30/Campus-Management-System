import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBookOpen, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Subjects = () => {
  const api = useMockApi();
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal controls
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [selectedSubject, setSelectedSubject] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    semester: 1,
    department: '',
    credits: 3
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('subjects');
      const deptList = await api.getCollection('departments');
      setSubjects(list);
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
      semester: 1,
      department: departments[0]?.name || '',
      credits: 4
    });
    setModalType('add');
    setModalOpen(true);
  };

  const handleOpenEdit = (sub) => {
    setSelectedSubject(sub);
    setFormData({
      name: sub.name,
      code: sub.code,
      semester: sub.semester,
      department: sub.department,
      credits: sub.credits
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this subject module?')) {
      try {
        await api.deleteItem('subjects', id);
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
        await api.createItem('subjects', formData);
      } else {
        await api.updateItem('subjects', selectedSubject.id, formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Subject Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 text-base dark:bg-slate-800 dark:text-indigo-400">
          <FaBookOpen className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</p>
          <p className="text-[10px] text-slate-400">Code: {row.code}</p>
        </div>
      </div>
    )},
    { header: 'Semester', accessor: 'semester', render: (row) => `Semester ${row.semester}` },
    { header: 'Department Allocation', accessor: 'department' },
    { header: 'Credits', accessor: 'credits', render: (row) => (
      <span className="rounded-md bg-slate-100 px-2 py-1 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-350">
        {row.credits} Credits
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
            Subject Modules
          </h1>
          <p className="text-xs text-slate-400">
            Define curriculum subjects, credit matrices, semester targets, and departmental alignments.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaBookOpen /> Add Subject
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={subjects}
          searchPlaceholder="Search by subject name..."
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
        title={modalType === 'add' ? 'Add New Subject' : 'Edit Subject Module'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <InputField
            label="Subject Name"
            id="name"
            placeholder="e.g. Database Management Systems"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Subject Code"
              id="code"
              placeholder="e.g. CSE-301"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
            />
            <InputField
              label="Credits Allocation"
              id="credits"
              type="select"
              options={[1, 2, 3, 4, 5]}
              value={formData.credits}
              onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
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
              label="Target Semester"
              id="semester"
              type="select"
              options={[1, 2, 3, 4, 5, 6, 7, 8]}
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {modalType === 'add' ? 'Create Subject' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subjects;
