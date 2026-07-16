import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMockApi } from '../../hooks/useMockApi';
import { FaMoneyBillWave, FaDollarSign, FaHistory, FaCheckCircle } from 'react-icons/fa';
import DataTable from '../../components/Tables/DataTable';
import Modal from '../../components/Modals/Modal';
import InputField from '../../components/Forms/InputField';
import Button from '../../components/Buttons/Button';
import Loader from '../../components/Loader/Loader';

const Fees = () => {
  const { user } = useAuth();
  const api = useMockApi();
  const [loading, setLoading] = useState(true);
  const [studentDetails, setStudentDetails] = useState(null);
  const [transactions, setTransactions] = useState([]);

  // Pay Modal
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState(0);
  const [payMode, setPayMode] = useState('UPI');
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const id = user?.id || 'STU001';
      const stuList = await api.getCollection('students');
      const details = stuList.find(s => s.id === id) || stuList[0];
      setStudentDetails(details);

      const txList = await api.getFeesTransactions(details.id);
      setTransactions(txList);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, api]);

  const handleOpenPay = () => {
    setPayAmount(studentDetails.balanceFees);
    setPayMode('UPI');
    setPayModalOpen(true);
  };

  const handlePayDues = async (e) => {
    e.preventDefault();
    if (payAmount <= 0) return;

    setPaying(true);
    setSuccess('');

    try {
      await api.payFees(studentDetails.id, payAmount, payMode);
      setSuccess('Payment processed successfully via Vanguard Gateway!');
      setTimeout(() => {
        setPayModalOpen(false);
        setSuccess('');
        loadData();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setPaying(false);
    }
  };

  const txColumns = [
    { header: 'Transaction ID', accessor: 'id' },
    { header: 'Amount Paid', accessor: 'amount', render: (row) => `$${row.amount.toLocaleString()}` },
    { header: 'Transaction Date', accessor: 'date' },
    { header: 'Payment Method', accessor: 'mode' },
    { header: 'Payment status', accessor: 'status', render: (row) => (
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
      <div className="flex flex-col justify-between items-start gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-850 dark:text-slate-100">
            My Invoice Dues & Balances
          </h1>
          <p className="text-xs text-slate-400">
            Review outstanding tuition invoices, pay dues via the mock gateway, and track transactions logs.
          </p>
        </div>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Paid Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 flex items-center gap-4">
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-slate-805 dark:text-emerald-400">
            <FaCheckCircle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Total Paid Fees</span>
            <span className="text-2xl font-black text-slate-805 dark:text-slate-100 font-display">
              ${studentDetails?.paidFees.toLocaleString() || '0'}
            </span>
          </div>
        </div>

        {/* Balance Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-855 dark:bg-slate-900 flex justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-rose-50 p-3 text-rose-600 dark:bg-slate-805 dark:text-rose-400">
              <FaMoneyBillWave className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">Outstanding Balance</span>
              <span className={`text-2xl font-black font-display ${
                studentDetails?.balanceFees > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                ${studentDetails?.balanceFees.toLocaleString() || '0'}
              </span>
            </div>
          </div>
          {studentDetails?.balanceFees > 0 && (
            <Button 
              onClick={handleOpenPay}
              variant="primary"
              className="py-1.5 px-3 rounded-lg text-xs"
            >
              Pay Now
            </Button>
          )}
        </div>
      </div>

      {/* Transaction Log list */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 dark:border-slate-855 dark:bg-slate-900">
        <h3 className="text-xs font-bold text-slate-805 dark:text-slate-205 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <FaHistory className="text-indigo-500" /> Payment Transaction Log
        </h3>
        <DataTable
          columns={txColumns}
          data={transactions}
          searchPlaceholder="Search Transaction ID..."
          searchKey="id"
          pageSize={5}
        />
      </div>

      {/* Payment gateway modal */}
      <Modal
        isOpen={payModalOpen}
        onClose={() => setPayModalOpen(false)}
        title="Institutional Payment Gateway"
      >
        <form onSubmit={handlePayDues} className="space-y-4">
          <p className="text-xs text-slate-405 dark:text-slate-400 leading-relaxed font-semibold">
            Invoice payment details for Roll ID <strong>{studentDetails?.rollNo}</strong>. Outstanding fee invoice amounts: <strong>${studentDetails?.balanceFees.toLocaleString()}</strong>.
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
            label="Payment Gateway Mode"
            id="payMode"
            type="select"
            options={['UPI (Vanguard pay)', 'Credit Card', 'Net Banking']}
            value={payMode}
            onChange={(e) => setPayMode(e.target.value)}
            required
          />

          {success && (
            <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-650 dark:text-emerald-400 animate-pulse">
              <FaCheckCircle /> {success}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="secondary" onClick={() => setPayModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={paying}>
              Authorize Payment
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;
