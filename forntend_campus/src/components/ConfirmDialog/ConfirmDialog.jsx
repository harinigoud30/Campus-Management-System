import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ConfirmDialog = ({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel, variant = 'danger' }) => {
  const variantStyles = {
    danger: {
      icon: 'text-rose-500',
      iconBg: 'bg-rose-100 dark:bg-rose-950/40',
      btn: 'bg-rose-600 hover:bg-rose-700 dark:bg-rose-700 dark:hover:bg-rose-600 text-white'
    },
    warning: {
      icon: 'text-amber-500',
      iconBg: 'bg-amber-100 dark:bg-amber-950/40',
      btn: 'bg-amber-600 hover:bg-amber-700 text-white'
    },
    info: {
      icon: 'text-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-950/40',
      btn: 'bg-blue-600 hover:bg-blue-700 text-white'
    }
  };

  const vs = variantStyles[variant] || variantStyles.danger;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onCancel}
          />
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
          >
            {/* Close */}
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <FaTimes />
            </button>

            {/* Icon */}
            <div className={`w-12 h-12 rounded-2xl ${vs.iconBg} flex items-center justify-center mb-4`}>
              <FaExclamationTriangle className={`text-xl ${vs.icon}`} />
            </div>

            {/* Content */}
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">
              {title || 'Are you sure?'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              {message || 'This action cannot be undone.'}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${vs.btn}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
