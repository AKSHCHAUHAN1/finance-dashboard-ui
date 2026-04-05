import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../../data/mockData';
import SelectMenu from '../common/SelectMenu';

export default function TransactionForm({ transaction, onClose }) {
  const { dispatch } = useApp();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: transaction?.description || '',
    amount: transaction?.amount || '',
    category: transaction?.category || '',
    type: transaction?.type || 'expense',
    date: transaction?.date || new Date().toISOString().split('T')[0],
  });
  const [errors, setErrors] = useState({});

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!form.amount || form.amount <= 0) e.amount = 'Must be positive';
    if (!form.category) e.category = 'Required';
    if (!form.date) e.date = 'Required';
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, amount: parseFloat(form.amount) };
    if (isEdit) {
      dispatch({ type: 'UPDATE_TRANSACTION', payload: { ...transaction, ...payload } });
    } else {
      dispatch({ type: 'ADD_TRANSACTION', payload: { ...payload, id: 'txn_' + Math.random().toString(36).substr(2, 9), status: 'completed' } });
    }
    onClose();
  };

  const fieldClasses = (field) =>
    `w-full bg-section border-2 ${errors[field] ? 'border-coral' : 'border-transparent'} rounded-xl px-4 py-3 text-sm text-main placeholder:text-muted focus:ring-0 focus:border-ink-soft/40 focus:bg-card transition-all outline-none font-body`;

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Type Toggle */}
      <div>
        <label className="label-micro block mb-2">Transaction Type</label>
        <div className="flex bg-section rounded-xl p-1">
          {['expense', 'income'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, type: t, category: '' })}
              className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                form.type === t ? 'bg-card shadow-ambient text-display' : 'text-muted'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label-micro block mb-2">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          placeholder="E.g., Monthly rent payment"
          className={fieldClasses('description')}
        />
        {errors.description && <p className="text-coral text-xs mt-1 font-medium">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label-micro block mb-2">Amount ($)</label>
          <input
            type="number"
            step="0.01"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            placeholder="0.00"
            className={fieldClasses('amount')}
          />
          {errors.amount && <p className="text-coral text-xs mt-1 font-medium">{errors.amount}</p>}
        </div>
        <div>
          <label className="label-micro block mb-2">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={e => setForm({ ...form, date: e.target.value })}
            className={fieldClasses('date')}
          />
        </div>
      </div>

      <div>
        <label className="label-micro block mb-2">Category</label>
        <SelectMenu
          up={true}
          value={form.category}
          onChange={val => setForm({ ...form, category: val })}
          options={categories}
          placeholder="Select category..."
          className={`w-full bg-section border-2 ${errors.category ? 'border-coral' : 'border-transparent'} rounded-xl px-4 py-3 text-sm text-main placeholder:text-muted focus:ring-0 focus:border-ink-soft/40 focus:bg-card transition-all outline-none font-body`}
        />
        {errors.category && <p className="text-coral text-xs mt-1 font-medium">{errors.category}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClose}
          className="flex-1 px-6 py-3 rounded-xl text-sm font-bold text-display hover:bg-section transition-colors">
          Cancel
        </button>
        <button type="submit"
          className="flex-1 px-6 py-3 rounded-xl text-sm font-bold gradient-cta text-white shadow-lg hover:opacity-90 transition-all"
          style={{ boxShadow: '0 4px 14px rgba(0,21,62,0.2)' }}>
          {isEdit ? 'Update' : 'Add Transaction'}
        </button>
      </div>
    </form>
  );
}
