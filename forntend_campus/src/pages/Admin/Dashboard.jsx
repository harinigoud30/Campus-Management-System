import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaUserGraduate, FaChalkboardTeacher, FaBuilding, FaDollarSign, FaCalendarAlt, FaBullhorn } from 'react-icons/fa';
import StatsCard from '../../components/Cards/StatsCard';
import OverviewChart from '../../components/Charts/OverviewChart';
import ActivityCard from '../../components/Cards/ActivityCard';
import Loader from '../../components/Loader/Loader';

const Dashboard = () => {
  const api = useMockApi();
  const [stats, setStats] = useState({
    students: 0,
    faculty: 0,
    departments: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [feeChartData, setFeeChartData] = useState([]);
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const studentsList = await api.getCollection('students');
        const facultyList = await api.getCollection('faculty');
        const deptsList = await api.getCollection('departments');
        const noticesList = await api.getCollection('notices');

        // Revenue calculation
        const totalRevenue = studentsList.reduce((sum, s) => sum + s.paidFees, 0);

        setStats({
          students: studentsList.length,
          faculty: facultyList.length,
          departments: deptsList.length,
          revenue: totalRevenue
        });

        // Chart Data: Students per department
        const deptDistribution = deptsList.map(d => {
          const count = studentsList.filter(s => s.department === d.name).length;
          return { name: d.code, Students: count };
        });
        setChartData(deptDistribution);

        // Chart Data: Fee collection details
        const feeCollected = studentsList.reduce((sum, s) => sum + s.paidFees, 0);
        const feePending = studentsList.reduce((sum, s) => sum + s.balanceFees, 0);
        setFeeChartData([
          { name: 'Collected', value: feeCollected },
          { name: 'Pending', value: feePending }
        ]);

        // Dynamic notices targeting 'All' or 'Faculty' or 'Student'
        setNotices(noticesList.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [api]);

  // Mock static timeline events
  const recentActivities = [
    { id: 1, content: 'Student roll CSE-22-005 registered by admin', time: '1 hour ago', type: 'success' },
    { id: 2, content: 'Grace Hopper modified attendance log for DBMS', time: '3 hours ago', type: 'info' },
    { id: 3, content: 'Notice "End Semester Exam Schedule" broadcasted', time: '1 day ago', type: 'alert' }
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Admin Dashboard
        </h1>
        <p className="text-xs text-slate-400">
          Comprehensive real-time campus statistics and operation control center.
        </p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats.students}
          icon={<FaUserGraduate />}
          trend="+4.2%"
          description="from last semester"
        />
        <StatsCard
          title="Active Faculty"
          value={stats.faculty}
          icon={<FaChalkboardTeacher />}
          trend="Stable"
          trendType="neutral"
          description="98% daily attendance"
        />
        <StatsCard
          title="Departments"
          value={stats.departments}
          icon={<FaBuilding />}
          description="Undergraduate & Postgrad"
        />
        <StatsCard
          title="Collected Fees"
          value={`$${stats.revenue.toLocaleString()}`}
          icon={<FaDollarSign />}
          trend="+12.4%"
          trendType="positive"
          description="vs target projection"
        />
      </div>

      {/* Graphical Insights section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Department Strength Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900 lg:col-span-2">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4">
            Enrollment Strength by Department
          </h3>
          <OverviewChart 
            type="bar" 
            data={chartData} 
            dataKeys={['Students']} 
            xKey="name" 
            colors={['#6366f1']}
          />
        </div>

        {/* Tuition Fee Share */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-850 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-850 dark:text-slate-200 uppercase tracking-wider mb-4">
            Tuition Fee Share ($)
          </h3>
          <OverviewChart 
            type="pie" 
            data={feeChartData} 
            colors={['#10b981', '#f43f5e']} 
            height={280}
          />
        </div>
      </div>

      {/* Feeds and Announcements */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recent Audit Timeline */}
        <ActivityCard title="System Audit Stream" activities={recentActivities} />

        {/* Notices/Announcements Widget */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FaBullhorn className="text-indigo-500" /> Active Campus Broadcasts
          </h3>
          <div className="space-y-4">
            {notices.map(notice => (
              <div 
                key={notice.id} 
                className="rounded-xl border border-slate-100 p-4 transition-all duration-200 hover:border-slate-200 hover:shadow-xs dark:border-slate-800/80 dark:hover:border-slate-700"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                    {notice.title}
                  </h4>
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400">
                    {notice.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-2 line-clamp-2">
                  {notice.content}
                </p>
                <span className="text-[9px] text-slate-400 font-medium">
                  Released: {notice.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
