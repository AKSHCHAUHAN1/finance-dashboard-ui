import { useApp } from '../../context/AppContext';
import { formatCurrency, formatShortDate } from '../../utils/formatters';
import { ArrowUpRight, ArrowDownLeft, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecentTransactions() {
  const { state } = useApp();
  const navigate = useNavigate();
  const recent = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div className="bg-card p-8 rounded-xl hover-lift animate-enter stagger-4">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold font-headline text-display tracking-tight">Recent Transactions</h3>
        <button onClick={() => navigate('/transactions')} className="flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-ink transition-colors">
          View All <ArrowRight size={14} />
        </button>
      </div>
      <div className="space-y-1">
        {recent.map((t, i) => (
          <div key={t.id} style={{ animationDelay: `${(i + 1) * 50}ms` }} className="flex items-center justify-between py-3.5 group hover:bg-section hover:scale-[1.02] hover:shadow-ambient hover:z-10 rounded-xl px-4 -mx-4 transition-all duration-300 animate-enter">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                t.type === 'income' ? 'bg-emerald-container/20 text-emerald' : 'bg-coral-container/20 text-coral'
              }`}>
                {t.type === 'income' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
              </div>
              <div>
                <p className="text-sm font-semibold text-main">{t.description}</p>
                <p className="text-xs text-muted font-medium">{formatShortDate(t.date)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-headline font-extrabold tracking-tight ${
                t.type === 'income' ? 'text-emerald' : 'text-main'
              }`}>
                {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
              </p>
              <span className="label-micro text-[10px]">{t.category}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
