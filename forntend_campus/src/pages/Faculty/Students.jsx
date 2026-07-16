import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaUserGraduate, FaEnvelope, FaPhone } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Loader from '../../components/Loader/Loader';

const Students = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [facultyDetails, setFacultyDetails] = useState(null);

  useEffect(() => {
    const loadFacultyStudents = async () => {
      try {
        const name = user?.name || 'Dr. Grace Hopper';
        const list = await api.getCollection('faculty');
        const details = list.find(f => f.name === name) || list[1];
        setFacultyDetails(details);

        // Fetch students belonging to the faculty's department
        const stuList = await api.getCollection('students');
        const deptStudents = stuList.filter(s => s.department === details.department);
        setStudents(deptStudents);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadFacultyStudents();
    }
  }, [user, api]);

  const columns = [
    { header: 'Student Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 font-bold dark:bg-slate-800 dark:text-indigo-400">
          {row.name.charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</p>
          <p className="text-[10px] text-slate-400">{row.rollNo}</p>
        </div>
      </div>
    )},
    { header: 'Affiliated Course', accessor: 'course', render: (row) => (
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-205 dark:text-slate-200">{row.course}</p>
        <p className="text-[10px] text-slate-400">Semester {row.semester}</p>
      </div>
    )},
    { header: 'Attendance %', accessor: 'attendance', render: (row) => (
      <span className="font-semibold text-slate-700 dark:text-slate-350">{row.attendance}%</span>
    )},
    { header: 'CGPA', accessor: 'cgpa', render: (row) => (
      <span className="font-bold text-indigo-600 dark:text-indigo-400">{row.cgpa} GPA</span>
    )},
    { header: 'Contact Links', accessor: 'email', render: (row) => (
      <div className="flex gap-2 text-slate-400">
        <a 
          href={`mailto:${row.email}`} 
          className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          title="Send Email"
        >
          <FaEnvelope />
        </a>
        <a 
          href={`tel:${row.phone}`} 
          className="rounded-lg p-1.5 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
          title="Call Student"
        >
          <FaPhone />
        </a>
      </div>
    )}
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Departmental Student Roster
          {facultyDetails && <span className="text-slate-400 font-normal"> - {facultyDetails.department}</span>}
        </h1>
        <p className="text-xs text-slate-400">
          View personal details, semester allocations, cumulative attendance averages, and scores.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={students}
          searchPlaceholder="Search student directory..."
          searchKey="name"
          pageSize={6}
        />
      </div>
    </div>
  );
};

export default Students;
