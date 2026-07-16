import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Students = () => {
  const api = useMockApi();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal control
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('add'); // add, edit
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: '',
    course: '',
    semester: 1,
    cgpa: 0,
    paidFees: 0,
    balanceFees: 0,
    status: 'Active'
  });

  const loadData = async () => {
    try {
      const list = await api.getCollection('students');
      const deptList = await api.getCollection('departments');
      const crsList = await api.getCollection('courses');
      setStudents(list);
      setDepartments(deptList);
      setCourses(crsList);
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
      rollNo: '',
      department: departments[0]?.name || '',
      course: courses[0]?.name || '',
      semester: 1,
      cgpa: 0,
      paidFees: 0,
      balanceFees: 0,
      status: 'Active'
    });
    setModalType('add');
    setModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setSelectedStudent(student);
    setFormData({
      name: student.name,
      email: student.email,
      rollNo: student.rollNo,
      department: student.department,
      course: student.course,
      semester: student.semester,
      cgpa: student.cgpa,
      paidFees: student.paidFees,
      balanceFees: student.balanceFees,
      status: student.status
    });
    setModalType('edit');
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student record?')) {
      try {
        await api.deleteItem('students', id);
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
        await api.createItem('students', formData);
      } else {
        await api.updateItem('students', selectedStudent.id, formData);
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Student Name', accessor: 'name', render: (row) => (
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
    { header: 'Roll No', accessor: 'rollNo' },
    { header: 'Department', accessor: 'department' },
    { header: 'Course', accessor: 'course', render: (row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-200">{row.course}</p>
        <p className="text-[10px] text-slate-400">Semester {row.semester}</p>
      </div>
    )},
    { header: 'CGPA', accessor: 'cgpa' },
    { header: 'Status', accessor: 'status', render: (row) => {
      const active = row.status === 'Active';
      return (
        <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[9px] font-semibold ${
          active 
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
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
            Student Management
          </h1>
          <p className="text-xs text-slate-400">
            Manage students profile directories, departments allocation, semesters, and performance.
          </p>
        </div>
        <Button 
          onClick={handleOpenAdd}
          variant="primary"
          className="flex items-center gap-2 rounded-xl text-xs py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white"
        >
          <FaUserPlus /> Add Student
        </Button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={students}
          searchPlaceholder="Search by student name..."
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
        title={modalType === 'add' ? 'Add New Student' : 'Edit Student Profile'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            id="name"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <InputField
            label="Email Address"
            id="email"
            type="email"
            placeholder="john.doe@campus.edu"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Roll Number"
              id="rollNo"
              placeholder="CSE-22-001"
              value={formData.rollNo}
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              required
            />
            <InputField
              label="Status"
              id="status"
              type="select"
              options={['Active', 'On Probation', 'Suspended']}
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              label="Course"
              id="course"
              type="select"
              options={courses.map(c => c.name)}
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField
              label="Semester"
              id="semester"
              type="select"
              options={[1, 2, 3, 4, 5, 6, 7, 8]}
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: Number(e.target.value) })}
              required
            />
            <InputField
              label="Current CGPA"
              id="cgpa"
              type="number"
              placeholder="e.g. 8.9"
              value={formData.cgpa}
              onChange={(e) => setFormData({ ...formData, cgpa: Number(e.target.value) })}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {modalType === 'add' ? 'Create Student' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
