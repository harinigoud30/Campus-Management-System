import React, { useEffect, useState } from 'react';
import { mockDb } from '../../services/mockData';
import { useToast } from '../../context/ToastContext';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';
import EmptyState from '../../components/EmptyState/EmptyState';
import Loader from '../../components/Loader/Loader';
import { FaHotel, FaPlus, FaEdit, FaTrash, FaUser, FaBed, FaWifi } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ITEMS_PER_PAGE = 6;

const STATUS_BADGE = {
  'Fully Occupied': 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
  'Partially Occupied': 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
  'Vacant': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
};

const EMPTY_FORM = { blockName: 'Block A (Boys)', roomNumber: '', floor: 1, type: 'Double Sharing', capacity: 2, amenities: [], monthlyRent: 8000 };

const AdminHostel = () => {
  const toast = useToast();
  const [rooms, setRooms] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterBlock, setFilterBlock] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showAllotModal, setShowAllotModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [allotRoom, setAllotRoom] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messMenu, setMessMenu] = useState({});
  const [activeTab, setActiveTab] = useState('rooms');
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const today = days[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

  useEffect(() => {
    setRooms(mockDb.getCollection('hostel'));
    setStudents(mockDb.getCollection('students'));
    setMessMenu(mockDb.getMessMenu());
    setLoading(false);
  }, []);

  const blocks = [...new Set(rooms.map(r => r.blockName))];
  const filtered = rooms.filter(r => (!filterBlock || r.blockName === filterBlock) && (!filterStatus || r.status === filterStatus));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const computeStatus = (room) => {
    if (room.occupants.length === 0) return 'Vacant';
    if (room.occupants.length >= room.capacity) return 'Fully Occupied';
    return 'Partially Occupied';
  };

  const handleSave = () => {
    if (!form.roomNumber) return toast.error('Validation', 'Room number is required.');
    const updatedForm = { ...form };
    if (editingRoom) {
      mockDb.updateItem('hostel', editingRoom.id, updatedForm);
      toast.success('Room Updated', `Room ${form.roomNumber} updated.`);
    } else {
      mockDb.createItem('hostel', { ...updatedForm, occupants: [], status: 'Vacant' });
      toast.success('Room Added', `Room ${form.roomNumber} added to hostel.`);
    }
    setRooms(mockDb.getCollection('hostel'));
    setShowModal(false);
    setEditingRoom(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = () => {
    mockDb.deleteItem('hostel', deleteConfirm.id);
    setRooms(mockDb.getCollection('hostel'));
    toast.success('Room Removed', `Room ${deleteConfirm.roomNumber} deleted.`);
    setDeleteConfirm(null);
  };

  const handleAllot = () => {
    if (!selectedStudent) return toast.warning('Select', 'Please select a student.');
    const student = students.find(s => s.id === selectedStudent);
    const db_rooms = mockDb.getCollection('hostel');
    const room = db_rooms.find(r => r.id === allotRoom.id);
    if (room.occupants.length >= room.capacity) return toast.error('Full', 'Room is at full capacity.');
    if (!room.occupants.includes(selectedStudent)) {
      room.occupants.push(selectedStudent);
      room.status = computeStatus(room);
      mockDb.updateItem('hostel', room.id, room);
    }
    setRooms(mockDb.getCollection('hostel'));
    toast.success('Allotted', `${student.name} allotted to Room ${room.roomNumber}.`);
    setShowAllotModal(false);
    setSelectedStudent('');
  };

  const handleDeallocate = (roomId, studentId) => {
    const db_rooms = mockDb.getCollection('hostel');
    const room = db_rooms.find(r => r.id === roomId);
    room.occupants = room.occupants.filter(id => id !== studentId);
    room.status = computeStatus(room);
    mockDb.updateItem('hostel', room.id, room);
    setRooms(mockDb.getCollection('hostel'));
    toast.info('Deallocated', 'Student removed from room.');
  };

  const stats = [
    { label: 'Total Rooms', value: rooms.length },
    { label: 'Fully Occupied', value: rooms.filter(r => r.status === 'Fully Occupied').length },
    { label: 'Partially Occupied', value: rooms.filter(r => r.status === 'Partially Occupied').length },
    { label: 'Vacant', value: rooms.filter(r => r.status === 'Vacant').length },
  ];

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Hostel Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage hostel rooms, allotments, and mess schedule.</p>
        </div>
        <button onClick={() => { setEditingRoom(null); setForm(EMPTY_FORM); setShowModal(true); }} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors shadow-sm">
          <FaPlus /> Add Room
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-indigo-600">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-fit">
        {['rooms', 'mess'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all capitalize ${activeTab === tab ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            {tab === 'rooms' ? 'Room Allotment' : 'Mess Menu'}
          </button>
        ))}
      </div>

      {activeTab === 'rooms' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap gap-3">
            <select value={filterBlock} onChange={e => { setFilterBlock(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none">
              <option value="">All Blocks</option>{blocks.map(b => <option key={b}>{b}</option>)}
            </select>
            <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 focus:outline-none">
              <option value="">All Status</option>{['Vacant','Partially Occupied','Fully Occupied'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          {paginated.length === 0 ? <EmptyState icon={FaHotel} title="No rooms found" description="Add hostel rooms to get started." actionLabel="Add Room" onAction={() => setShowModal(true)} /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {paginated.map(room => {
                const occupantNames = room.occupants.map(oid => students.find(s => s.id === oid)?.name || oid);
                return (
                  <motion.div key={room.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 dark:border-slate-800 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100">Room {room.roomNumber}</h3>
                        <p className="text-xs text-slate-400">{room.blockName} · Floor {room.floor}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[room.status]}`}>{room.status}</span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1 mb-3">
                      <div className="flex items-center gap-2"><FaBed /> {room.type} · {room.occupants.length}/{room.capacity} occupants</div>
                      <div className="flex items-center gap-2"><FaWifi /> {room.amenities.join(', ')}</div>
                      <div className="font-semibold text-slate-700 dark:text-slate-300">₹{room.monthlyRent.toLocaleString()}/month</div>
                    </div>
                    {occupantNames.length > 0 && (
                      <div className="mb-3 space-y-1">
                        {room.occupants.map((oid, i) => (
                          <div key={oid} className="flex items-center justify-between rounded-lg bg-slate-50 dark:bg-slate-800 px-2 py-1">
                            <span className="text-xs text-slate-700 dark:text-slate-300 flex items-center gap-1.5"><FaUser className="text-slate-400" />{occupantNames[i]}</span>
                            <button onClick={() => handleDeallocate(room.id, oid)} className="text-xs text-rose-500 hover:underline">Remove</button>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      {room.occupants.length < room.capacity && <button onClick={() => { setAllotRoom(room); setShowAllotModal(true); }} className="flex-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 py-1.5 text-xs font-semibold hover:bg-indigo-100 transition-colors">+ Allot Student</button>}
                      <button onClick={() => { setEditingRoom(room); setForm({ blockName: room.blockName, roomNumber: room.roomNumber, floor: room.floor, type: room.type, capacity: room.capacity, amenities: room.amenities, monthlyRent: room.monthlyRent }); setShowModal(true); }} className="rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-1.5 text-xs hover:bg-slate-200 transition-colors"><FaEdit /></button>
                      <button onClick={() => setDeleteConfirm(room)} className="rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-500 p-1.5 text-xs hover:bg-rose-100 transition-colors"><FaTrash /></button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          <div className="px-4"><Pagination currentPage={page} totalPages={Math.ceil(filtered.length / ITEMS_PER_PAGE)} onPageChange={setPage} itemsPerPage={ITEMS_PER_PAGE} totalItems={filtered.length} /></div>
        </div>
      )}

      {activeTab === 'mess' && (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Weekly Mess Menu</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>{['Day', 'Breakfast', 'Lunch', 'Snacks', 'Dinner'].map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {days.map(day => (
                  <tr key={day} className={`hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors ${day === today ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-200">
                      {day} {day === today && <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 ml-1">(Today)</span>}
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{messMenu[day]?.breakfast || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{messMenu[day]?.lunch || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{messMenu[day]?.snacks || '—'}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{messMenu[day]?.dinner || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-5">{editingRoom ? 'Edit Room' : 'Add Hostel Room'}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Block</label>
                <select value={form.blockName} onChange={e => setForm({ ...form, blockName: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none">
                  {['Block A (Boys)','Block B (Girls)','Block C (Boys)','Block D (Girls)'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Room No. *</label><input value={form.roomNumber} onChange={e => setForm({ ...form, roomNumber: e.target.value })} placeholder="A-101" className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Floor</label><input type="number" min={1} value={form.floor} onChange={e => setForm({ ...form, floor: +e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Room Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none">
                  {['Single Occupancy','Double Sharing','Triple Sharing'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Capacity</label><input type="number" min={1} max={4} value={form.capacity} onChange={e => setForm({ ...form, capacity: +e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Monthly Rent (₹)</label><input type="number" value={form.monthlyRent} onChange={e => setForm({ ...form, monthlyRent: +e.target.value })} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none" /></div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
              <button onClick={handleSave} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">{editingRoom ? 'Update' : 'Add Room'}</button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Allot Student Modal */}
      {showAllotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAllotModal(false)} />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl p-6">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-1">Allot Student</h2>
            <p className="text-xs text-slate-400 mb-4">Room {allotRoom?.roomNumber} · {allotRoom?.blockName}</p>
            <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 mb-5">
              <option value="">-- Select Student --</option>
              {students.filter(s => !allotRoom?.occupants.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.name} ({s.rollNo})</option>)}
            </select>
            <div className="flex gap-3">
              <button onClick={() => setShowAllotModal(false)} className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={handleAllot} className="flex-1 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">Allot Room</button>
            </div>
          </motion.div>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteConfirm} title="Delete Room?" message={`Remove Room ${deleteConfirm?.roomNumber} from the system?`} confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteConfirm(null)} />
    </div>
  );
};

export default AdminHostel;
