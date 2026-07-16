import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaBriefcase, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Placements = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [placements, setPlacements] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  
  // Track applied status locally: { [placementId]: true/false }
  const [appliedMap, setAppliedMap] = useState({});
  const [msg, setMsg] = useState({ id: null, text: '', type: 'success' });

  const loadData = async () => {
    try {
      const id = user?.id || 'STU001';
      const stuList = await api.getCollection('students');
      const details = stuList.find(s => s.id === id) || stuList[0];
      setStudentDetails(details);

      const list = await api.getCollection('placements');
      setPlacements(list);

      // Restore simulated applied state from storage
      const stored = localStorage.getItem(`applied_plc_${details.id}`);
      if (stored) {
        setAppliedMap(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, api]);

  const handleApply = async (drive) => {
    // Check eligibility logic
    // Extract minimum CGPA (usually matches "CGPA > 8.0" or similar)
    const matchCgpa = drive.eligibility.match(/CGPA > (\d+\.\d+|\d+)/);
    const minCgpa = matchCgpa ? parseFloat(matchCgpa[1]) : 0;
    
    if (studentDetails.cgpa < minCgpa) {
      setMsg({
        id: drive.id,
        text: `Ineligible: Minimum GPA criteria is ${minCgpa}. You have ${studentDetails.cgpa}.`,
        type: 'error'
      });
      return;
    }

    try {
      // Increment applied count in database
      const newApplied = drive.applied + 1;
      await api.updateItem('placements', drive.id, {
        applied: newApplied
      });

      // Update applied status
      const updatedApplied = { ...appliedMap, [drive.id]: true };
      setAppliedMap(updatedApplied);
      localStorage.setItem(`applied_plc_${studentDetails.id}`, JSON.stringify(updatedApplied));

      setMsg({
        id: drive.id,
        text: 'Successfully registered for this placement drive!',
        type: 'success'
      });

      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { header: 'Hiring Recruiters', accessor: 'company', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-650 font-bold dark:bg-slate-800 dark:text-indigo-400">
          <FaBriefcase className="h-4 w-4" />
        </div>
        <div>
          <p className="font-semibold text-slate-850 dark:text-slate-205 dark:text-slate-200">{row.company}</p>
          <p className="text-[10px] text-slate-400">{row.designation}</p>
        </div>
      </div>
    )},
    { header: 'Package Offer', accessor: 'package', render: (row) => (
      <span className="font-bold text-slate-805 dark:text-slate-100">{row.package}</span>
    )},
    { header: 'Branch Eligibility', accessor: 'eligibility' },
    { header: 'Drive Date', accessor: 'driveDate' },
    { header: 'Status', accessor: 'status', render: (row) => {
      const upcoming = row.status === 'Upcoming';
      return (
        <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${
          upcoming 
            ? 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400' 
            : 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400'
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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Career Placement Portal
        </h1>
        <p className="text-xs text-slate-400">
          Apply to upcoming campus recruitment drives and monitor criteria specifications.
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-855 dark:bg-slate-900">
        <DataTable
          columns={columns}
          data={placements}
          searchPlaceholder="Search placements drives..."
          searchKey="company"
          pageSize={6}
          actions={(row) => {
            const isCompleted = row.status === 'Completed';
            const isApplied = appliedMap[row.id];

            if (isCompleted) {
              return (
                <span className="text-[10px] text-slate-400 font-semibold italic">Drive Completed</span>
              );
            }

            if (isApplied) {
              return (
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <FaCheckCircle /> Applied
                </span>
              );
            }

            return (
              <div className="flex flex-col items-end gap-1.5">
                <button
                  onClick={() => handleApply(row)}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-705 transition-colors"
                >
                  Register / Apply
                </button>
                {msg.id === row.id && (
                  <span className={`text-[8px] font-bold ${msg.type === 'error' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {msg.text}
                  </span>
                )}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Placements;
