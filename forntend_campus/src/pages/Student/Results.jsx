import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaGraduationCap, FaAward, FaEye } from 'react-icons/fa';
import OverviewChart from '../../components/Charts/OverviewChart';
import DataTable from '../../components/Tables/DataTable';
import Loader from '../../components/Loader/Loader';

const Results = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [selectedSem, setSelectedSem] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const id = user?.id || 'STU001';
        const list = await api.getStudentResults(id);
        setResults(list);
        if (list.length > 0) {
          // Select last semester by default
          setSelectedSem(list[list.length - 1]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchResults();
    }
  }, [user, api]);

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  // Compile GPA progression data for chart
  const gpaChartData = results.map(r => ({
    name: `Sem ${r.semester}`,
    GPA: r.gpa
  }));

  // Calculate Cumulative CGPA
  const cgpa = results.length > 0 
    ? Math.round(results.reduce((sum, r) => sum + r.gpa, 0) / results.length * 100) / 100
    : 8.9;

  const subjectColumns = [
    { header: 'Subject Course', accessor: 'name', render: (row) => (
      <p className="font-semibold text-slate-850 dark:text-slate-205 dark:text-slate-200">{row.name}</p>
    )},
    { header: 'Grade Secured', accessor: 'grade', render: (row) => {
      const isPass = row.grade !== 'F';
      return (
        <span className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-bold ${
          isPass 
            ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-950/20 dark:text-emerald-400' 
            : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
        }`}>
          {row.grade}
        </span>
      );
    }}
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            My Academic Transcripts
          </h1>
          <p className="text-xs text-slate-400">
            Review semester examination gradesheets, SGPA cards, and cumulative grade point averages (CGPA).
          </p>
        </div>
      </div>

      {/* Stats Summary row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* CGPA card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 flex items-center gap-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-650 dark:bg-slate-800 dark:text-indigo-400">
            <FaGraduationCap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Cumulative CGPA</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-display">{cgpa} GPA</span>
          </div>
        </div>

        {/* Semesters Cleared */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 flex items-center gap-4">
          <div className="rounded-xl bg-indigo-50 p-3 text-indigo-650 dark:bg-slate-800 dark:text-indigo-400">
            <FaAward className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Completed Semesters</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 font-display">{results.length} Semesters</span>
          </div>
        </div>
      </div>

      {/* GPA Progression chart */}
      {gpaChartData.length > 1 && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-205 dark:text-slate-200 uppercase tracking-wider mb-4">
            GPA Semester Progression
          </h3>
          <OverviewChart
            type="area"
            data={gpaChartData}
            dataKeys={['GPA']}
            colors={['#6366f1']}
          />
        </div>
      )}

      {/* Tab select list & detailed gradesheet */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Semester Selection */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Select Semesters</h3>
          
          {results.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No transcripts available</p>
          ) : (
            results.map((sem) => (
              <div
                key={sem.semester}
                onClick={() => setSelectedSem(sem)}
                className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  selectedSem?.semester === sem.semester
                    ? 'border-indigo-505 border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 font-semibold'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span>Semester {sem.semester}</span>
                <span className="font-bold text-xs bg-slate-50 dark:bg-slate-800/80 px-2 py-0.5 rounded-md">
                  {sem.gpa} GPA
                </span>
              </div>
            ))
          )}
        </div>

        {/* Detailed grades list */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Detailed Gradesheet - Semester {selectedSem?.semester || 'None Selected'}
          </h3>

          {selectedSem ? (
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-855 dark:bg-slate-900">
              <DataTable
                columns={subjectColumns}
                data={selectedSem.subjects}
                searchPlaceholder="Filter subjects..."
                searchKey="name"
                pageSize={6}
              />
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 p-12 text-center text-xs text-slate-400 dark:border-slate-800">
              Select a semester on the left to view grades
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Results;
