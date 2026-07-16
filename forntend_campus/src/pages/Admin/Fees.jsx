import React, { useEffect, useState } from 'react';
import { useMockApi } from '../../hooks/useMockApi';
import { FaMoneyBillWave, FaDollarSign, FaHistory, FaPlus } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Fees = () => {
  const api = useMockApi();
  const [students, setStudents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [activeTab, setActiveTab] = useState('balances'); // balances, transactions
  const [loading, setLoading] = useState(true);

  // Collect Payment Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [payAmount, setPayAmount] = useState(0);
  const [payMode, setPayMode] = useState('UPI');

  const loadData = async () => {
    try {
      const stuList = await api.getCollection('students');
      const txList = await api.getCollection('feesTransactions');
      setStudents(stuList);
      setTransactions(txList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [api]);

  const handleOpenCollect = (student) => {
    setSelectedStudent(student);
    setPayAmount(student.balanceFees);
    setPayMode('UPI');
    setModalOpen(true);
  };

  const handleCollectFees = async (e) => {
    e.preventDefault();
    if (payAmount <= 0) return;
    try {
      await api.payFees(selectedStudent.id, payAmount, payMode);
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const balanceColumns = [
    { header: 'Student Name', accessor: 'name', render: (row) => (
      <p className="font-semibold text-slate-850 dark:text-slate-200">{row.name}</p>
    )},
    { header: 'Roll No', accessor: 'rollNo' },
    { header: 'Course Program', accessor: 'course' },
    { header: 'Tuition Paid', accessor: 'paidFees', render: (row) => `$${row.paidFees.toLocaleString()}` },
    { header: 'Outstanding Balance', accessor: 'balanceFees', render: (row) => (
      <span className={`font-semibold ${row.balanceFees > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
        ${row.balanceFees.toLocaleString()}
      </span>
    )}
  ];

  const transactionColumns = [
    { header: 'Transaction ID', accessor: 'id' },
    { header: 'Student ID', accessor: 'studentId' },
    { header: 'Amount Paid', accessor: 'amount', render: (row) => `$${row.amount.toLocaleString()}` },
    { header: 'Payment Date', accessor: 'date' },
    { header: 'Mode', accessor: 'mode' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className="inline-flex items-center justify-center rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
        {row.status}
      </span>
    )}
  ];

  if (loading) {
    return <div className="flex h-96 items-center justify-center"><Loader /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
          Fees & Revenue Directory
        </h1>
        <p className="text-xs text-slate-400">
          Track outstanding tuition fees, verify transactions, and record payments.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-4 border-b border-slate-150 dark:border-slate-800 pb-px">
        <button
          onClick={() => setActiveTab('balances')}
          className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'balances' 
              ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
          }`}
        >
          <FaMoneyBillWave /> Outstanding Balances
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 pb-3 text-xs font-semibold border-b-2 transition-all ${
            activeTab === 'transactions' 
              ? 'border-indigo-650 text-indigo-650 dark:border-indigo-400 dark:text-indigo-400' 
              : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
          }`}
        >
          <FaHistory /> Transaction History
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-850 dark:bg-slate-900">
        {activeTab === 'balances' ? (
          <DataTable
            columns={balanceColumns}
            data={students}
            searchPlaceholder="Search by student name..."
            searchKey="name"
            pageSize={6}
            actions={(row) => (
              <button
                disabled={row.balanceFees === 0}
                onClick={() => handleOpenCollect(row)}
                className="rounded-lg px-2.5 py-1.5 text-xs font-semibold bg-indigo-50 text-indigo-650 hover:bg-indigo-100 disabled:opacity-40 disabled:pointer-events-none dark:bg-slate-800 dark:text-indigo-400 dark:hover:bg-slate-700 flex items-center gap-1"
              >
                <FaDollarSign /> Collect Dues
              </button>
            )}
          />
        ) : (
          <DataTable
            columns={transactionColumns}
            data={transactions}
            searchPlaceholder="Search by Transaction ID..."
            searchKey="id"
            pageSize={6}
          />
        )}
      </div>

      {/* Collect Fee payment modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Record Payment - ${selectedStudent?.name}`}
      >
        <form onSubmit={handleCollectFees} className="space-y-4">
          <p className="text-xs text-slate-400 leading-relaxed">
            Recording payment for Roll ID <strong>{selectedStudent?.rollNo}</strong>. Current outstanding dues are <strong>${selectedStudent?.balanceFees.toLocaleString()}</strong>.
          </p>

          <InputField
            label="Payment Amount ($)"
            id="payAmount"
            type="number"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            required
          />

          <InputField
            label="Payment Mode"
            id="payMode"
            type="select"
            options={['UPI', 'Credit Card', 'Debit Card', 'Net Banking', 'Cash / Check']}
            value={payMode}
            onChange={(e) => setPayMode(e.target.value)}
            required
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Record Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;
