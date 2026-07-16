import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { FaBars, FaSearch, FaBell, FaSun, FaMoon, FaUser, FaSignOutAlt, FaChevronDown, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const Navbar = ({ toggleSidebar, toggleCollapse }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Sample dynamic notifications
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New assignment posted', desc: 'Grace Hopper posted DBMS Normalization exercises.', time: '10 mins ago', type: 'assignment', read: false },
    { id: 2, title: 'Exam timetable released', desc: 'End semester exam schedule is now available.', time: '2 hours ago', type: 'exam', read: false },
    { id: 3, title: 'Upcoming Placement Drive', desc: 'Google ASE drive registration closes soon.', time: '1 day ago', type: 'placement', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getProfileLink = () => {
    if (user?.role === 'admin') return '/admin/settings';
    return `/${user?.role}/profile`;
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/80">
      
      {/* Left: Sidebar Toggles & Search */}
      <div className="flex items-center gap-4">
        {/* Mobile Toggle */}
        <button 
          onClick={toggleSidebar}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
        >
          <FaBars className="h-5 w-5" />
        </button>

        {/* Desktop Toggle (Collapse) */}
        <button 
          onClick={toggleCollapse}
          className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:block"
        >
          <FaBars className="h-5 w-5" />
        </button>

        {/* Search Bar */}
        <div className="relative hidden max-w-xs sm:block">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <FaSearch className="h-4 w-4" />
          </span>
          <input 
            type="text" 
            placeholder="Search students, classes, etc..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-10 pr-4 text-sm outline-hidden transition-all duration-200 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-200 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
          />
        </div>
      </div>

      {/* Right: Actions (Theme, Notifications, Profile) */}
      <div className="flex items-center gap-4">
        {/* Light/Dark Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          title="Toggle Light/Dark Theme"
        >
          {theme === 'dark' ? <FaSun className="h-5 w-5 text-amber-500" /> : <FaMoon className="h-5 w-5 text-indigo-600" />}
        </button>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <FaBell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown menu */}
          {showNotifications && (
            <NotificationDropdown
              notifications={notifications}
              onMarkAllRead={markAllRead}
              onClose={() => setShowNotifications(false)}
            />
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {user && (
              <>
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-8 w-8 rounded-lg object-cover ring-2 ring-indigo-500/10"
                />
                <span className="hidden text-left sm:block">
                  <p className="truncate text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">{user.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize leading-none">{user.role}</p>
                </span>
                <FaChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
              </>
            )}
          </button>

          {/* Profile Menu Dropdown */}
          {showProfileMenu && user && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-2xl border border-slate-100 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-800">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                <p className="truncate font-semibold text-xs text-slate-800 dark:text-slate-200">{user.name}</p>
                <p className="truncate text-[10px] text-slate-400">{user.email}</p>
              </div>

              <Link
                to={getProfileLink()}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
              >
                <FaUser className="h-3.5 w-3.5 text-slate-400" />
                <span>My Profile</span>
              </Link>
              
              <Link
                to="/admin/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50"
              >
                <FaSun className="h-3.5 w-3.5 text-slate-400" />
                <span>Settings</span>
              </Link>

              <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20"
              >
                <FaSignOutAlt className="h-3.5 w-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
