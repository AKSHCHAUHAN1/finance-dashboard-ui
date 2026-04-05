import { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatShortDate } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, MoreVertical, Edit3, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionFilters from './TransactionFilters';
import EmptyState from '../common/EmptyState';
import Modal from '../common/Modal';
import TransactionForm from './TransactionForm';

export default function TransactionList() {
  const { state, dispatch } = useApp();
  const isAdmin = state.role === 'admin';
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [actionMenu, setActionMenu] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 10;
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActionMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filtered = useMemo(() => {
    let data = [...state.transactions];
    const f = state.filters;

    if (f.search) {
      const s = f.search.toLowerCase();
      data = data.filter(t => t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    if (f.category) data = data.filter(t => t.category === f.category);
    if (f.type) data = data.filter(t => t.type === f.type);
    if (f.startDate) data = data.filter(t => t.date >= f.startDate);
    if (f.endDate) data = data.filter(t => t.date <= f.endDate);

    const [key, dir] = (f.sortBy || 'date-desc').split('-');
    data.sort((a, b) => {
      const va = key === 'date' ? new Date(a.date) : a.amount;
      const vb = key === 'date' ? new Date(b.date) : b.amount;
      return dir === 'asc' ? va - vb : vb - va;
    });
    return data;
  }, [state.transactions, state.filters]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const periodIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const periodExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netCashflow = periodIncome - periodExpenses;
  const menuOpen = actionMenu !== null;

  const getCategoryIcon = (type) => type === 'income' ? ArrowDownLeft : ArrowUpRight;

  return (
    <div className="bg-section rounded-xl overflow-visible">
      <TransactionFilters />

      {paginated.length === 0 ? (
        <EmptyState title="No transactions found" description="Try adjusting your search or filter criteria." />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] table-fixed text-left border-collapse">
              <thead>
                <tr className="bg-inset/50">
                  <th className="w-[14%] px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-muted whitespace-nowrap">Date</th>
                  <th className="w-[32%] px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-muted whitespace-nowrap">Description</th>
                  <th className="w-[20%] px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-muted whitespace-nowrap text-center">Category</th>
                  <th className="w-[14%] px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-muted whitespace-nowrap text-center">Type</th>
                  <th className="w-[16%] px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-muted whitespace-nowrap text-right">Amount</th>
                  {isAdmin && <th className="w-[4%] px-6 py-4 text-[13px] font-extrabold uppercase tracking-[0.12em] text-muted"></th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map((t, i) => {
                  const Icon = getCategoryIcon(t.type);
                  const isMenuOpen = actionMenu === t.id;
                  return (
                    <tr key={t.id} style={{ animationDelay: `${i * 30}ms` }} className={`bg-card group hover:bg-section hover:shadow-ambient transition-all duration-300 animate-fade border-b border-ghost cursor-pointer relative ${isMenuOpen ? 'z-30' : (menuOpen ? 'z-0' : 'z-auto')}`}>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-sm text-main">{formatShortDate(t.date)}</span>
                          <span className="text-[10px] text-muted font-medium">{new Date(t.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            t.type === 'income' ? 'bg-emerald-container/20 text-emerald' : 'bg-coral-container/20 text-coral'
                          }`}>
                            <Icon size={15} />
                          </div>
                          <span className="font-semibold text-sm text-main">{t.description}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-semibold text-main">
                          {t.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center justify-center gap-1 ${t.type === 'income' ? 'text-emerald' : 'text-coral'}`}>
                          <Icon size={12} />
                          <span className="font-bold text-xs uppercase tracking-tight">{t.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-headline font-extrabold tracking-tight text-main">
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 text-right">
                          <div className="relative inline-flex" ref={isMenuOpen ? menuRef : null}>
                            <button
                              onClick={() => setActionMenu(actionMenu === t.id ? null : t.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-display"
                            >
                              <MoreVertical size={16} />
                            </button>
                            {isMenuOpen && (
                              <div className="absolute right-0 top-8 bg-card border border-ghost rounded-xl shadow-elevated py-1 z-50 min-w-[140px] animate-scale-in">
                                <button
                                  onClick={() => { setEditingTransaction(t); setActionMenu(null); }}
                                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-section transition-colors text-main"
                                >
                                  <Edit3 size={14} /> Edit
                                </button>
                                <button
                                  onClick={() => { dispatch({ type: 'DELETE_TRANSACTION', payload: t.id }); setActionMenu(null); }}
                                  className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-2 hover:bg-section transition-colors text-coral"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer Summary */}
          <div className="p-6 bg-section border-t border-ghost">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] items-end gap-6">
              <div className="flex items-end gap-8">
                <div className="min-w-[180px]">
                  <span className="label-micro text-[10px]">Period Income</span>
                  <span className="mt-1 block text-2xl leading-none font-headline font-extrabold text-emerald tracking-tighter">+{formatCurrency(periodIncome)}</span>
                </div>
                <div className="min-w-[180px]">
                  <span className="label-micro text-[10px]">Period Expenses</span>
                  <span className="mt-1 block text-2xl leading-none font-headline font-extrabold text-main tracking-tighter">-{formatCurrency(periodExpenses)}</span>
                </div>
              </div>
              <div className="order-3 lg:order-2 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/10 transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={24} className="text-display" />
                </button>
                <span className="font-headline text-base font-bold text-display leading-none w-16 text-center">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/10 transition-colors disabled:opacity-30"
                >
                  <ChevronRight size={24} className="text-display" />
                </button>
              </div>
              <div className="order-2 lg:order-3 flex justify-start lg:justify-end">
                <div className="text-left lg:text-right min-w-[210px]">
                  <span className="label-micro text-[10px]">Net Cashflow</span>
                  <span className={`mt-1 block text-2xl leading-none font-headline font-extrabold tracking-tighter ${netCashflow >= 0 ? 'text-emerald' : 'text-coral'}`}>
                    {netCashflow >= 0 ? '+' : ''}{formatCurrency(netCashflow)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {editingTransaction && (
        <Modal onClose={() => setEditingTransaction(null)} title="Edit Transaction">
          <TransactionForm transaction={editingTransaction} onClose={() => setEditingTransaction(null)} />
        </Modal>
      )}
    </div>
  );
}
