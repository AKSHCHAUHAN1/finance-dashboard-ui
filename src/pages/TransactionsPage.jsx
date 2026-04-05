import { useState } from 'react';
import { useApp } from '../context/AppContext';
import TransactionList from '../components/transactions/TransactionList';
import TransactionForm from '../components/transactions/TransactionForm';
import Modal from '../components/common/Modal';
import { Plus, Download } from 'lucide-react';

export default function TransactionsPage() {
  const { state } = useApp();
  const isAdmin = state.role === 'admin';
  const [showAdd, setShowAdd] = useState(false);

  const exportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
    const rows = state.transactions.map(t => [t.date, t.description, t.category, t.type, t.amount]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'transactions.csv'; a.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline text-3xl font-extrabold text-display tracking-tight">Transaction Ledger</h2>
          <p className="text-sub font-medium mt-1">Review and manage your historical financial movements.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-sub bg-card shadow-ambient hover:scale-105 active:scale-95 hover:bg-section transition-all duration-300"
          >
            <Download size={15} /> Export
          </button>
          {isAdmin && (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 gradient-cta text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 shadow-elevated hover:shadow-dramatic"
              style={{ boxShadow: '0 4px 14px rgba(0,21,62,0.2)' }}
            >
              <Plus size={16} strokeWidth={2.5} /> New Transaction
            </button>
          )}
        </div>
      </div>
      <TransactionList />
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)} title="New Transaction">
          <TransactionForm onClose={() => setShowAdd(false)} />
        </Modal>
      )}
    </div>
  );
}
