import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import EmptyState from '../../components/EmptyState/EmptyState';
import Pagination from '../../components/Pagination/Pagination';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import Loader from '../../components/Loader/Loader';
import { FaBook, FaSearch, FaArrowCircleRight, FaArrowCircleLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 8;

const StudentLibrary = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [myIssues, setMyIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('catalog');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setBooks(mockDb.getCollection('library'));
    if (user?.id) setMyIssues(mockDb.getStudentLibraryIssues(user.id));
    setLoading(false);
  }, [user]);

  const categories = [...new Set(books.map(b => b.category))];
  const filtered = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || b.category === filterCat;
    return matchSearch && matchCat;
  });
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeIssues = myIssues.filter(i => i.status !== 'Returned');

  const handleRequest = (book) => {
    if (!user?.details) return toast.warning('Profile Incomplete', 'User profile data not found.');
    const alreadyIssued = activeIssues.find(i => i.bookId === book.id);
    if (alreadyIssued) return toast.warning('Already Issued', 'You already have a copy of this book.');
    if (book.availableCopies <= 0) return toast.error('Unavailable', 'No copies of this book are currently available.');
    const result = mockDb.issueBook(book.id, user.id, user.name, user.details?.rollNo || 'STU-000');
    if (result) {
      setBooks(mockDb.getCollection('library'));
      setMyIssues(mockDb.getStudentLibraryIssues(user.id));
      toast.success('Book Issued!', `"${book.title}" has been issued to you. Due: ${result.dueDate}`);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  const statusColor = { Issued: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400', Returned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400', Overdue: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Library</h1>
        <p className="text-xs text-slate-400 mt-0.5">Browse the campus library catalog and manage your issued books.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Books in Library', value: books.length },
          { label: 'Books Issued to Me', value: activeIssues.length },
          { label: 'Total I\'ve Borrowed', value: myIssues.length },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        {['catalog', 'mybooks'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            {tab === 'catalog' ? 'Book Catalog' : 'My Books'}
          </button>
        ))}
      </div>

      {activeTab === 'catalog' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <SearchFilter
              searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
              searchPlaceholder="Search by title or author..."
              filters={[{ key: 'cat', label: 'All Categories', options: categories.map(c => ({ value: c, label: c })) }]}
              filterValues={{ cat: filterCat }} onFilterChange={(k, v) => { setFilterCat(v); setPage(1); }}
              onClear={() => { setSearch(''); setFilterCat(''); }}
            />
          </div>
          {paginated.length === 0 ? <EmptyState icon={FaBook} title="No books found" description="Try a different search term." /> : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {paginated.map(book => {
                  const alreadyIssued = activeIssues.find(i => i.bookId === book.id);
                  return (
                    <motion.div key={book.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 flex flex-col hover:shadow-md transition-shadow">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${book.category === 'Computer Science' ? 'bg-indigo-100 dark:bg-indigo-950/30' : book.category === 'Mathematics' ? 'bg-amber-100 dark:bg-amber-950/30' : 'bg-emerald-100 dark:bg-emerald-950/30'}`}>
                        <FaBook className={`${book.category === 'Computer Science' ? 'text-indigo-500' : book.category === 'Mathematics' ? 'text-amber-500' : 'text-emerald-500'}`} />
                      </div>
                      <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 leading-tight mb-1 line-clamp-2">{book.title}</h4>
                      <p className="text-xs text-slate-400 mb-1">{book.author}</p>
                      <span className="rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-500 dark:text-slate-400 w-fit mb-3">{book.category}</span>
                      <div className="mt-auto flex items-center justify-between">
                        <span className={`text-xs font-semibold ${book.availableCopies === 0 ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {book.availableCopies === 0 ? 'Not Available' : `${book.availableCopies} available`}
                        </span>
                        <button
                          onClick={() => handleRequest(book)}
                          disabled={alreadyIssued || book.availableCopies === 0}
                          className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${alreadyIssued ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : book.availableCopies === 0 ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                        >
                          {alreadyIssued ? 'Issued' : 'Issue'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              <div className="px-4"><Pagination currentPage={page} totalPages={Math.ceil(filtered.length / ITEMS_PER_PAGE)} onPageChange={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={filtered.length} /></div>
            </>
          )}
        </div>
      )}

      {activeTab === 'mybooks' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {myIssues.length === 0 ? <EmptyState icon={FaBook} title="No books issued" description="Issue a book from the catalog to see it here." actionLabel="Browse Catalog" onAction={() => setActiveTab('catalog')} /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>{['Book Title', 'Issued On', 'Due Date', 'Return Date', 'Status', 'Fine'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                  {myIssues.map(issue => (
                    <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{issue.bookTitle}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{issue.issueDate}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{issue.dueDate}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{issue.returnDate || '—'}</td>
                      <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColor[issue.status] || ''}`}>{issue.status}</span></td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{issue.fine > 0 ? <span className="text-rose-500 font-semibold">₹{issue.fine}</span> : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentLibrary;
