import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaChartBar, FaFileDownload, FaInfoCircle, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import OverviewChart from '../../components/Charts/OverviewChart';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Reports = () => {
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [gradeDistribution, setGradeDistribution] = useState([]);
  const [attendanceTrend, setAttendanceTrend] = useState([]);
  const [feeCollection, setFeeCollection] = useState([]);

  useEffect(() => {
    const loadReports = async () => {
      // Simulate reports database compile
      setTimeout(() => {
        setGradeDistribution([
          { name: 'O (Outstanding)', count: 18 },
          { name: 'A+ (Excellent)', count: 25 },
          { name: 'A (Very Good)', count: 32 },
          { name: 'B+ (Good)', count: 20 },
          { name: 'B (Above Average)', count: 12 },
          { name: 'C (Average)', count: 5 }
        ]);

        setAttendanceTrend([
          { name: 'Week 1', CSE: 92, ECE: 88, ME: 80 },
          { name: 'Week 2', CSE: 90, ECE: 85, ME: 78 },
          { name: 'Week 3', CSE: 94, ECE: 91, ME: 82 },
          { name: 'Week 4', CSE: 87, ECE: 84, ME: 76 },
          { name: 'Week 5', CSE: 89, ECE: 87, ME: 79 }
        ]);

        setFeeCollection([
          { name: 'CSE', Collected: 600000, Outstanding: 150000 },
          { name: 'ECE', Collected: 480000, Outstanding: 180000 },
          { name: 'ME', Collected: 350000, Outstanding: 120000 },
          { name: 'MBA', Collected: 450000, Outstanding: 50000 }
        ]);

        setLoading(false);
      }, 500);
    };

    loadReports();
  }, []);

  const handleExport = (format) => {
    alert(`Generating and compiling campus analytical data in ${format.toUpperCase()} format. Download will start momentarily!`);
  };

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  // Convert Grade list to Pie chart structure
  const gradePieData = gradeDistribution.map(g => ({ name: g.name.split(' ')[0], value: g.count }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            Reports & Analytical Sheets
          </h1>
          <p className="text-xs text-slate-400">
            Generate and export system-wide performance reports, fee reconciliations, and attendance audits.
          </p>
        </div>

        {/* Quick Exports */}
        <div className="flex gap-2">
          <Button 
            onClick={() => handleExport('pdf')}
            variant="outline"
            className="flex items-center gap-1.5 rounded-xl border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/20"
          >
            <FaFilePdf /> Export PDF
          </Button>
          <Button 
            onClick={() => handleExport('xlsx')}
            variant="outline"
            className="flex items-center gap-1.5 rounded-xl border-emerald-300 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900 dark:text-emerald-400 dark:hover:bg-emerald-950/20"
          >
            <FaFileExcel /> Export Excel
          </Button>
        </div>
      </div>

      {/* Analytics widgets grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        
        {/* Attendance trends */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4">
            Departmental Attendance Progression
          </h3>
          <OverviewChart
            type="area"
            data={attendanceTrend}
            dataKeys={['CSE', 'ECE', 'ME']}
            colors={['#6366f1', '#10b981', '#f43f5e']}
          />
        </div>

        {/* Financial collection */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4">
            Fee Collection Status by Department ($)
          </h3>
          <OverviewChart
            type="bar"
            data={feeCollection}
            dataKeys={['Collected', 'Outstanding']}
            colors={['#10b981', '#8b5cf6']}
          />
        </div>

        {/* Grade Share */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4">
            Academic Grade Share Distribution
          </h3>
          <OverviewChart
            type="pie"
            data={gradePieData}
            colors={['#6366f1', '#4f46e5', '#10b981', '#eab308', '#f97316', '#ef4444']}
            height={260}
          />
        </div>

        {/* Info panel */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <FaInfoCircle className="text-indigo-500" /> Reporting Audit Details
            </h3>
            <div className="space-y-3.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <p>
                <strong>Grade Distribution:</strong> Evaluated based on recent semester results entered by faculty mentors across all subject streams.
              </p>
              <p>
                <strong>Attendance Progression:</strong> Compiled weekly. CSE holds the highest consistency, while Mechanical Engineering has been flagged for lower turnouts.
              </p>
              <p>
                <strong>Revenue Collection:</strong> Vanguard has processed 82.5% of total tuition invoices. Outstanding invoices are largely from the Mechanical and Electronics sections.
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-800 text-[10px] text-slate-450 italic">
            * All compiled analytics are cached locally in student and faculty system registries.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;
