import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';
import SearchFilter from '../../components/SearchFilter/SearchFilter';
import EmptyState from '../../components/EmptyState/EmptyState';
import Loader from '../../components/Loader/Loader';
import { FaBook, FaPlus, FaEdit, FaTrash, FaArrowCircleRight, FaArrowCircleLeft, FaSearch } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 8;

const STATUS_BADGE = {
  Issued: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400',
  Returned: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
  Overdue: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
};

const AdminLibrary = () => {
  const toast = useToast();
  const [books, setBooks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('books');
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [page, setPage] = useState(1);
  const [issuePage, setIssuePage] = useState(1);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', category: 'Computer Science', totalCopies: 1, availableCopies: 1, location: '' });
  const [issueForm, setIssueForm] = useState({ bookId: '', studentId: '' });

  useEffect(() => {
    setBooks(mockDb.getCollection('library'));
    setIssues(mockDb.getCollection('libraryIssues'));
    setStudents(mockDb.getCollection('students'));
    setLoading(false);
  }, []);

  const categories = [...new Set(books.map(b => b.category))];

  const filteredBooks = books.filter(b => {
    const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search);
    const matchCat = !filterCat || b.category === filterCat;
    return matchSearch && matchCat;
  });

  const paginatedBooks = filteredBooks.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const activeIssues = issues.filter(i => i.status !== 'Returned');
  const paginatedIssues = issues.slice((issuePage - 1) * ITEMS_PER_PAGE, issuePage * ITEMS_PER_PAGE);

  const handleSaveBook = () => {
    if (!bookForm.title || !bookForm.author) return toast.error('Validation', 'Title and Author are required.');
    if (editingBook) {
      mockDb.updateItem('library', editingBook.id, bookForm);
      toast.success('Book Updated', `"${bookForm.title}" has been updated.`);
    } else {
      mockDb.createItem('library', { ...bookForm, issuedTo: [], addedDate: new Date().toISOString().split('T')[0] });
      toast.success('Book Added', `"${bookForm.title}" added to library.`);
    }
    setBooks(mockDb.getCollection('library'));
    setShowBookModal(false);
    setEditingBook(null);
    setBookForm({ title: '', author: '', isbn: '', category: 'Computer Science', totalCopies: 1, availableCopies: 1, location: '' });
  };

  const handleDeleteBook = (book) => {
    setDeleteConfirm(book);
  };

  const confirmDelete = () => {
    mockDb.deleteItem('library', deleteConfirm.id);
    setBooks(mockDb.getCollection('library'));
    toast.success('Book Removed', `"${deleteConfirm.title}" has been deleted.`);
    setDeleteConfirm(null);
  };

  const handleIssue = () => {
    if (!issueForm.bookId || !issueForm.studentId) return toast.warning('Select', 'Please select both book and student.');
    const student = students.find(s => s.id === issueForm.studentId);
    const result = mockDb.issueBook(issueForm.bookId, student.id, student.name, student.rollNo);
    if (!result) return toast.error('Issue Failed', 'No available copies of selected book.');
    setBooks(mockDb.getCollection('library'));
    setIssues(mockDb.getCollection('libraryIssues'));
    toast.success('Book Issued', `Book issued to ${student.name} successfully.`);
    setShowIssueModal(false);
    setIssueForm({ bookId: '', studentId: '' });
  };

  const handleReturn = (issue) => {
    mockDb.returnBook(issue.id);
    setIssues(mockDb.getCollection('libraryIssues'));
    setBooks(mockDb.getCollection('library'));
    toast.success('Book Returned', `"${issue.bookTitle}" returned successfully.`);
  };

  const openEditBook = (book) => {
    setEditingBook(book);
    setBookForm({ title: book.title, author: book.author, isbn: book.isbn, category: book.category, totalCopies: book.totalCopies, availableCopies: book.availableCopies, location: book.location });
    setShowBookModal(true);
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  const stats = [
    { label: 'Total Books', value: books.reduce((s, b) => s + b.totalCopies, 0), color: 'text-indigo-600' },
    { label: 'Available', value: books.reduce((s, b) => s + b.availableCopies, 0), color: 'text-emerald-600' },
    { label: 'Currently Issued', value: activeIssues.length, color: 'text-blue-600' },
    { label: 'Overdue', value: issues.filter(i => i.status === 'Overdue').length, color: 'text-rose-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Library Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage books, issues, and returns for campus library.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowIssueModal(true)} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm">
            <FaArrowCircleRight /> Issue Book
          </button>
          <button onClick={() => { setEditingBook(null); setBookForm({ title: '', author: '', isbn: '', category: 'Computer Science', totalCopies: 1, availableCopies: 1, location: '' }); setShowBookModal(true); }} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
            <FaPlus /> Add Book
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        {['books', 'issues'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            {tab === 'books' ? 'Book Catalog' : 'Issue / Return'}
          </button>
        ))}
      </div>

      {/* Books Table */}
      {activeTab === 'books' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <SearchFilter
              searchValue={search} onSearchChange={v => { setSearch(v); setPage(1); }}
              searchPlaceholder="Search by title, author, ISBN..."
              filters={[{ key: 'cat', label: 'All Categories', options: categories.map(c => ({ value: c, label: c })) }]}
              filterValues={{ cat: filterCat }} onFilterChange={(k, v) => { setFilterCat(v); setPage(1); }}
              onClear={() => { setSearch(''); setFilterCat(''); }}
            />
          </div>
          {paginatedBooks.length === 0 ? (
            <EmptyState icon={FaBook} title="No books found" description="Try adjusting your search or add new books." actionLabel="Add Book" onAction={() => setShowBookModal(true)} />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>{['Title', 'Author', 'Category', 'Location', 'Total', 'Available', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {paginatedBooks.map(book => (
                      <tr key={book.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-xs">{book.title}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{book.author}</td>
                        <td className="px-4 py-3"><span className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">{book.category}</span></td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{book.location}</td>
                        <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">{book.totalCopies}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`font-semibold ${book.availableCopies === 0 ? 'text-rose-500' : 'text-emerald-600'}`}>{book.availableCopies}</span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => openEditBook(book)} className="rounded-lg p-1.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"><FaEdit /></button>
                            <button onClick={() => handleDeleteBook(book)} className="rounded-lg p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4"><Pagination currentPage={page} totalPages={Math.ceil(filteredBooks.length / ITEMS_PER_PAGE)} onPageChange={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={filteredBooks.length} /></div>
            </>
          )}
        </div>
      )}

      {/* Issues Table */}
      {activeTab === 'issues' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          {paginatedIssues.length === 0 ? (
            <EmptyState icon={FaBook} title="No issue records" description="Issue a book to see records here." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>{['Book', 'Student', 'Issue Date', 'Due Date', 'Status', 'Fine', 'Action'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {paginatedIssues.map(issue => (
                      <tr key={issue.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200 max-w-[200px] truncate">{issue.bookTitle}</td>
                        <td className="px-4 py-3">
                          <div className="text-slate-800 dark:text-slate-200 font-medium">{issue.studentName}</div>
                          <div className="text-xs text-slate-400">{issue.rollNo}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{issue.issueDate}</td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{issue.dueDate}</td>
                        <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[issue.status] || ''}`}>{issue.status}</span></td>
                        <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{issue.fine > 0 ? `₹${issue.fine}` : '—'}</td>
                        <td className="px-4 py-3">
                          {issue.status !== 'Returned' && (
                            <button onClick={() => handleReturn(issue)} className="flex items-center gap-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-950/60 transition-colors">
                              <FaArrowCircleLeft /> Return
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4"><Pagination currentPage={issuePage} totalPages={Math.ceil(issues.length / ITEMS_PER_PAGE)} onPageChange={setIssuePage} itemsPerPage={ITEMS_PER_PAGE} totalItems={issues.length} /></div>
            </>
          )}
        </div>
      )}

      {/* Add/Edit Book Modal */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowBookModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Title *</label><input value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" /></div>
              <div className="col-span-2"><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Author *</label><input value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">ISBN</label><input value={bookForm.isbn} onChange={e => setBookForm({ ...bookForm, isbn: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Category</label><select value={bookForm.category} onChange={e => setBookForm({ ...bookForm, category: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">{['Computer Science', 'Electronics', 'Mathematics', 'Business', 'Physics', 'Literature'].map(c => <option key={c}>{c}</option>)}</select></div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Total Copies</label><input type="number" min={1} value={bookForm.totalCopies} onChange={e => setBookForm({ ...bookForm, totalCopies: +e.target.value, availableCopies: +e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Location (Rack)</label><input value={bookForm.location} onChange={e => setBookForm({ ...bookForm, location: e.target.value })} placeholder="Rack A-12" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowBookModal(false)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleSaveBook} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">{editingBook ? 'Update Book' : 'Add Book'}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Issue Book Modal */}
      {showIssueModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowIssueModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">Issue Book to Student</h2>
            <div className="space-y-4">
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Select Book</label>
                <select value={issueForm.bookId} onChange={e => setIssueForm({ ...issueForm, bookId: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  <option value="">-- Select Book --</option>
                  {books.filter(b => b.availableCopies > 0).map(b => <option key={b.id} value={b.id}>{b.title} ({b.availableCopies} available)</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Select Student</label>
                <select value={issueForm.studentId} onChange={e => setIssueForm({ ...issueForm, studentId: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40">
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowIssueModal(false)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleIssue} className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors">Issue Book</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Book?" message={`Are you sure you want to remove "${deleteConfirm?.title}" from the library? This action cannot be undone.`} confirmLabel="Delete" onConfirm={confirmDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
};

export default AdminLibrary;
