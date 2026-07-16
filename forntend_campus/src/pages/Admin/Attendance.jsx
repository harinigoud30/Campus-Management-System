import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaCalendarCheck, FaEdit } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Attendance = () => {
  const api = useMockApi();
  const [students, setStudents] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('All');

  // Edit attendance states
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceVal, setAttendanceVal] = useState(0);

  const loadData = async () => {
    try {
      const list = await api.getCollection('students');
      const deptList = await api.getCollection('departments');
      setStudents(list);
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

  const handleEditAttendance = (student) => {
    setSelectedStudent(student);
    setAttendanceVal(student.attendance);
    setModalOpen(true);
  };

  const handleSaveAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.updateItem('students', selectedStudent.id, {
        attendance: Number(attendanceVal)
      });
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Filter students based on HOD dropdown
  const filteredStudents = selectedDept === 'All' 
    ? students 
    : students.filter(s => s.department === selectedDept);

  const columns = [
    { header: 'Student Name', accessor: 'name', render: (row) => (
      <p className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</p>
    )},
    { header: 'Roll No', accessor: 'rollNo' },
    { header: 'Course', accessor: 'course' },
    { header: 'Department', accessor: 'department' },
    { header: 'Attendance %', accessor: 'attendance', render: (row) => {
      const pct = row.attendance;
      let colorClass = 'bg-emerald-50 text-emerald-605 dark:bg-emerald-950/20 dark:text-emerald-400';
      if (pct < 75) {
        colorClass = 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-450 dark:text-rose-400';
      } else if (pct < 85) {
        colorClass = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400';
      }

      return (
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${colorClass}`}>
            {pct}%
          </span>
          {/* Progress miniature */}
          <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
            <div 
              className={`h-full rounded-full ${
                pct < 75 ? 'bg-rose-500' : pct < 85 ? 'bg-amber-500' : 'bg-emerald-500'
              }`} 
              style={{ width: `${pct}%` }} 
            />
          </div>
        </div>
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
            Attendance Log Matrix
          </h1>
          <p className="text-xs text-slate-400">
            Audit general lecture/practical attendance logs. Flag profiles falling below standard criteria (75%).
          </p>
        </div>
        
        {/* Filter Dropdown */}
        <div className="w-48">
          <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">Filter Department</label>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 px-3 text-xs font-semibold outline-hidden dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
          >
            <option value="All">All Departments</option>
            {departments.map(d => (
              <option key={d.id} value={d.name}>{d.code}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={filteredStudents}
          searchPlaceholder="Search by student name..."
          searchKey="name"
          pageSize={6}
          actions={(row) => (
            <button 
              onClick={() => handleEditAttendance(row)}
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-650 dark:hover:bg-slate-800 dark:hover:text-indigo-400 flex items-center gap-1 text-[11px] font-semibold"
            >
              <FaEdit /> Edit Log
            </button>
          )}
        />
      </div>

      {/* Edit attendance modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Adjust Attendance - ${selectedStudent?.name}`}
      >
        <form onSubmit={handleSaveAttendance} className="space-y-4">
          <p className="text-xs text-slate-400">
            Adjust the semester attendance score for Roll ID <strong>{selectedStudent?.rollNo}</strong>.
          </p>
          
          <InputField
            label="Attendance percentage (%)"
            id="attendanceVal"
            type="number"
            placeholder="e.g. 85.4"
            value={attendanceVal}
            onChange={(e) => setAttendanceVal(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Attendance
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
