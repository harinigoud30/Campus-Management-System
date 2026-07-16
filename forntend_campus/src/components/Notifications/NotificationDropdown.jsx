import React from 'react';
import { FaBell, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

const NotificationDropdown = ({ 
  notifications = [], 
  onMarkAllRead, 
  onClose 
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl dark:border-slate-800 dark:bg-slate-800">
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-700">
        <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">Notifications</span>
        {unreadCount > 0 && (
          <button 
            onClick={onMarkAllRead} 
            className="text-xs font-semibold text-indigo-650 dark:text-indigo-400 hover:underline"
          >
            Mark all read
          </button>
        )}
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
        ) : (
          notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                !notif.read ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
              }`}
            >
              <div className={`mt-0.5 rounded-full p-2 h-fit text-sm ${
                notif.type === 'assignment' 
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400' 
                  : 'bg-indigo-50 text-indigo-650 dark:bg-indigo-950/20 dark:text-indigo-400'
              }`}>
                {notif.type === 'assignment' ? <FaCheckCircle /> : <FaCalendarAlt />}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className={`text-xs text-slate-705 dark:text-slate-300 ${!notif.read ? 'font-semibold' : ''}`}>
                  {notif.title}
                </p>
                <p className="truncate text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {notif.desc}
                </p>
                <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-1">
                  {notif.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
