import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, trend, trendType = 'positive', description }) => {
  const isPositive = trendType === 'positive';
  const isNeutral = trendType === 'neutral';

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="dashboard-card relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800/80 dark:bg-slate-900"
    >
      <div className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
            {title}
          </span>
          <span className="text-2xl font-bold text-slate-800 dark:text-slate-100 block mb-2 font-display">
            {value}
          </span>
        </div>
        <div className="rounded-xl bg-indigo-50/80 p-3 text-indigo-600 dark:bg-slate-800/50 dark:text-indigo-400">
          <span className="text-xl">{icon}</span>
        </div>
      </div>
      
      {/* Footer / Trend */}
      {(trend || description) && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          {trend && (
            <span className={`font-semibold ${
              isNeutral 
                ? 'text-slate-500' 
                : isPositive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
            }`}>
              {trend}
            </span>
          )}
          {description && (
            <span className="text-slate-400 font-medium">
              {description}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;
