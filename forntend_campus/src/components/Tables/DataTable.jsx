import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';

const DataTable = ({ 
  columns, 
  data = [], 
  searchPlaceholder = "Search...", 
  searchKey = "name",
  actions,
  pageSize = 5
}) => {
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Search filter
  const filteredData = data.filter(item => {
    if (!query) return true;
    const value = item[searchKey];
    if (value === undefined || value === null) return false;
    return value.toString().toLowerCase().includes(query.toLowerCase());
  });

  // Pagination calculations
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const currentData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full">
      {/* Search Header */}
      <div className="flex flex-col items-center justify-between gap-4 mb-4 sm:flex-row">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <FaSearch className="h-3.5 w-3.5" />
          </span>
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-9 pr-4 text-xs outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-400"
          />
        </div>
      </div>

      {/* Table Area */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-xs dark:border-slate-850 dark:bg-slate-900">
        <table className="w-full border-collapse text-left text-xs text-slate-600 dark:text-slate-400">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/40">
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="px-6 py-4 font-semibold">{col.header}</th>
              ))}
              {actions && <th className="px-6 py-4 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-slate-400 font-medium">
                  No matching records found
                </td>
              </tr>
            ) : (
              currentData.map((row, rowIdx) => (
                <tr key={row.id || rowIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-3.5 font-medium text-slate-700 dark:text-slate-350">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-3.5 text-right font-medium">
                      <div className="flex justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between gap-4 mt-4 px-2">
          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-slate-600 dark:text-slate-300">{startIndex + 1}</strong> to{' '}
            <strong className="text-slate-600 dark:text-slate-300">{endIndex}</strong> of{' '}
            <strong className="text-slate-600 dark:text-slate-300">{totalItems}</strong> entries
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <FaChevronLeft className="h-3 w-3" />
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              <FaChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
