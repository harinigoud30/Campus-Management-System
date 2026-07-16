import React from 'react';

const InputField = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  options = [], // for select type
  className = ''
}) => {
  const inputStyle = `w-full rounded-xl border py-2.5 px-4 text-xs font-medium outline-hidden transition-all duration-200 focus:ring-2 dark:bg-slate-900 dark:text-slate-200 ${
    error 
      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 dark:border-rose-800' 
      : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-800 dark:focus:border-indigo-400'
  }`;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      {type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={onChange}
          required={required}
          className={inputStyle}
        >
          <option value="" disabled>{placeholder || "Select option"}</option>
          {options.map((opt, idx) => (
            <option key={idx} value={opt.value !== undefined ? opt.value : opt}>
              {opt.label || opt}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          rows={4}
          className={inputStyle}
        />
      ) : (
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={inputStyle}
        />
      )}

      {error && (
        <p className="mt-1.5 text-[10px] font-semibold text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
