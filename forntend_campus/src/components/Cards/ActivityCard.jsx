import React from 'react';

const ActivityCard = ({ title, activities = [] }) => {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900">
      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">
        {title}
      </h3>
      
      {activities.length === 0 ? (
        <p className="text-xs text-slate-400 py-6 text-center">No recent activities</p>
      ) : (
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, idx) => (
              <li key={activity.id || idx}>
                <div className="relative pb-8">
                  {/* Timeline connecting vertical line */}
                  {idx !== activities.length - 1 && (
                    <span 
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-slate-100 dark:bg-slate-800" 
                      aria-hidden="true" 
                    />
                  )}
                  
                  <div className="relative flex space-x-3">
                    <div>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ring-8 ring-white dark:ring-slate-900 ${
                        activity.type === 'alert' 
                          ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400' 
                          : activity.type === 'success'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                            : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                      }`}>
                        {activity.icon || (idx + 1)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-xs text-slate-700 dark:text-slate-300">
                          {activity.content}{' '}
                          {activity.target && (
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {activity.target}
                            </span>
                          )}
                        </p>
                      </div>
                      <div className="text-right text-[10px] whitespace-nowrap text-slate-400">
                        <time>{activity.time}</time>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActivityCard;
