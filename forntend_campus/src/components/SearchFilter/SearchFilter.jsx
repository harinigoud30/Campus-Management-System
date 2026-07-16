import React from 'react';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';

const SearchFilter = ({ searchValue, onSearchChange, searchPlaceholder = 'Search...', filters = [], onFilterChange, filterValues = {}, onClear }) => {
  const hasActiveFilters = searchValue || Object.values(filterValues).some(v => v);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1 min-w-48">
        <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-9 pr-4 text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Filter Dropdowns */}
      {filters.map(filter => (
        <div key={filter.key} className="relative">
          <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none" />
          <select
            value={filterValues[filter.key] || ''}
            onChange={e => onFilterChange(filter.key, e.target.value)}
            className="appearance-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-2.5 pl-8 pr-8 text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all cursor-pointer"
          >
            <option value="">{filter.label}</option>
            {filter.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      ))}

      {/* Clear Button */}
      {hasActiveFilters && onClear && (
        <button
          onClick={onClear}
          className="flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/30 px-3 py-2.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors"
        >
          <FaTimes className="text-xs" /> Clear
        </button>
      )}
    </div>
  );
};

export default SearchFilter;
