import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

const TOAST_STYLES = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/60',
    icon: <FaCheckCircle className="text-emerald-500 text-lg shrink-0" />,
    title: 'text-emerald-800 dark:text-emerald-300',
    msg: 'text-emerald-700 dark:text-emerald-400'
  },
  error: {
    bg: 'bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/60',
    icon: <FaTimesCircle className="text-rose-500 text-lg shrink-0" />,
    title: 'text-rose-800 dark:text-rose-300',
    msg: 'text-rose-700 dark:text-rose-400'
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/60',
    icon: <FaExclamationTriangle className="text-amber-500 text-lg shrink-0" />,
    title: 'text-amber-800 dark:text-amber-300',
    msg: 'text-amber-700 dark:text-amber-400'
  },
  info: {
    bg: 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/60',
    icon: <FaInfoCircle className="text-blue-500 text-lg shrink-0" />,
    title: 'text-blue-800 dark:text-blue-300',
    msg: 'text-blue-700 dark:text-blue-400'
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, title, message, duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, type, title, message }]);
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (title, message, duration) => addToast('success', title, message, duration),
    error: (title, message, duration) => addToast('error', title, message, duration),
    warning: (title, message, duration) => addToast('warning', title, message, duration),
    info: (title, message, duration) => addToast('info', title, message, duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map(t => {
            const s = TOAST_STYLES[t.type] || TOAST_STYLES.info;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 40, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-xl ${s.bg}`}
              >
                {s.icon}
                <div className="flex-1 min-w-0">
                  {t.title && <p className={`font-semibold text-sm ${s.title}`}>{t.title}</p>}
                  {t.message && <p className={`text-xs mt-0.5 leading-relaxed ${s.msg}`}>{t.message}</p>}
                </div>
                <button
                  onClick={() => removeToast(t.id)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors shrink-0 mt-0.5"
                >
                  <FaTimes className="text-xs" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};
