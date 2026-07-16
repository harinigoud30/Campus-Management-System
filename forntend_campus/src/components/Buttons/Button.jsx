import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  className = ''
}) => {
  const baseStyle = 'inline-flex items-center justify-center rounded-xl px-4 py-2.5 font-semibold text-xs transition-all duration-200 outline-hidden active:scale-98 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs focus:ring-2 focus:ring-indigo-500/30 dark:bg-indigo-650 dark:hover:bg-indigo-700',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200',
    outline: 'border border-slate-200 hover:bg-slate-50 text-slate-700 dark:border-slate-800 dark:hover:bg-slate-800 dark:text-slate-200',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs focus:ring-2 focus:ring-rose-500/30 dark:bg-rose-650 dark:hover:bg-rose-700',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs focus:ring-2 focus:ring-amber-500/30'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          <div className="mr-2 h-4.5 w-4.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          <span>Loading...</span>
        </>
      ) : children}
    </button>
  );
};

export default Button;
