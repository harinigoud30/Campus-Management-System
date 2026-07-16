import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  FaThLarge, FaUserGraduate, FaChalkboardTeacher, FaBuilding, FaBook, 
  FaBookOpen, FaCalendarCheck, FaCalendarAlt, FaMoneyBillWave, FaBullhorn, 
  FaCalendarDay, FaBriefcase, FaChartBar, FaCog, FaUser, FaSignOutAlt, FaTimes,
  FaHotel, FaClipboardList, FaExclamationCircle, FaCertificate, FaFileAlt
} from 'react-icons/fa';

const Sidebar = ({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', label: 'Dashboard', icon: <FaThLarge /> },
          { path: '/admin/students', label: 'Students', icon: <FaUserGraduate /> },
          { path: '/admin/faculty', label: 'Faculty', icon: <FaChalkboardTeacher /> },
          { path: '/admin/departments', label: 'Departments', icon: <FaBuilding /> },
          { path: '/admin/courses', label: 'Courses', icon: <FaBook /> },
          { path: '/admin/subjects', label: 'Subjects', icon: <FaBookOpen /> },
          { path: '/admin/attendance', label: 'Attendance', icon: <FaCalendarCheck /> },
          { path: '/admin/timetable', label: 'Timetable', icon: <FaCalendarAlt /> },
          { path: '/admin/exam-schedule', label: 'Exam Schedule', icon: <FaCalendarDay /> },
          { path: '/admin/fees', label: 'Fees Management', icon: <FaMoneyBillWave /> },
          { path: '/admin/library', label: 'Library', icon: <FaBook /> },
          { path: '/admin/hostel', label: 'Hostel', icon: <FaHotel /> },
          { path: '/admin/leave-requests', label: 'Leave Requests', icon: <FaClipboardList /> },
          { path: '/admin/notices', label: 'Notices', icon: <FaBullhorn /> },
          { path: '/admin/events', label: 'Events', icon: <FaCalendarDay /> },
          { path: '/admin/placements', label: 'Placements', icon: <FaBriefcase /> },
          { path: '/admin/reports', label: 'Reports & Analytics', icon: <FaChartBar /> },
          { path: '/admin/settings', label: 'Settings', icon: <FaCog /> }
        ];
      case 'faculty':
        return [
          { path: '/faculty/dashboard', label: 'Dashboard', icon: <FaThLarge /> },
          { path: '/faculty/attendance', label: 'Attendance', icon: <FaCalendarCheck /> },
          { path: '/faculty/assignments', label: 'Assignments', icon: <FaBookOpen /> },
          { path: '/faculty/marks', label: 'Marks Entry', icon: <FaChartBar /> },
          { path: '/faculty/students', label: 'My Students', icon: <FaUserGraduate /> },
          { path: '/faculty/leave', label: 'Leave Application', icon: <FaClipboardList /> },
          { path: '/faculty/profile', label: 'My Profile', icon: <FaUser /> }
        ];
      case 'student':
        return [
          { path: '/student/dashboard', label: 'Dashboard', icon: <FaThLarge /> },
          { path: '/student/attendance', label: 'Attendance', icon: <FaCalendarCheck /> },
          { path: '/student/results', label: 'Results', icon: <FaChartBar /> },
          { path: '/student/assignments', label: 'Assignments', icon: <FaBookOpen /> },
          { path: '/student/timetable', label: 'Timetable', icon: <FaCalendarAlt /> },
          { path: '/student/exam-schedule', label: 'Exam Schedule', icon: <FaCalendarDay /> },
          { path: '/student/fees', label: 'Fees & Dues', icon: <FaMoneyBillWave /> },
          { path: '/student/library', label: 'Library', icon: <FaBook /> },
          { path: '/student/hostel', label: 'Hostel', icon: <FaHotel /> },
          { path: '/student/leave', label: 'Leave Application', icon: <FaClipboardList /> },
          { path: '/student/grievance', label: 'Grievance', icon: <FaExclamationCircle /> },
          { path: '/student/certificates', label: 'Certificates', icon: <FaCertificate /> },
          { path: '/student/notices', label: 'Notices', icon: <FaBullhorn /> },
          { path: '/student/events', label: 'Events', icon: <FaCalendarDay /> },
          { path: '/student/placements', label: 'Placements', icon: <FaBriefcase /> },
          { path: '/student/profile', label: 'My Profile', icon: <FaUser /> }
        ];
      default:
        return [];
    }
  };

  const navLinks = getLinks();

  const sidebarVariants = {
    open: { x: 0, width: isCollapsed ? '80px' : '260px' },
    closed: { x: '-100%', width: '260px' }
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial="closed"
        animate={isOpen ? "open" : "open"} // handle responsive logic
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col border-r border-slate-200/80 bg-white text-slate-800 transition-all duration-300 dark:border-slate-800/80 dark:bg-slate-900 dark:text-slate-100 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
      >
        {/* Brand Logo & Close button */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200/80 dark:border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-md shadow-indigo-200 dark:shadow-none">
              CMS
            </div>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-display font-bold text-lg bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-400 whitespace-nowrap"
              >
                Vanguard Portal
              </motion.span>
            )}
          </div>
          <button 
            className="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* User Info (Collapsed vs Expanded) */}
        {!isCollapsed && user && (
          <div className="mx-4 my-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/40">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="overflow-hidden">
                <h4 className="truncate font-semibold text-sm text-slate-800 dark:text-slate-200">{user.name}</h4>
                <p className="truncate text-xs text-indigo-600 font-medium dark:text-indigo-400 capitalize">{user.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-sm transition-all duration-200 group ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-50/80 to-violet-50/80 text-indigo-700 dark:from-indigo-950/40 dark:to-violet-950/40 dark:text-indigo-400' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-indigo-400'
                }`
              }
            >
              <span className="text-lg transition-transform group-hover:scale-110">
                {link.icon}
              </span>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  {link.label}
                </motion.span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-slate-200/80 p-3 dark:border-slate-800/80">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-sm text-rose-600 transition-colors duration-200 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
          >
            <FaSignOutAlt className="text-lg" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
