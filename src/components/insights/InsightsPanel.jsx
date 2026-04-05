import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../data/mockData';
import { TrendingUp, Home, Lightbulb, Repeat, DollarSign, Target, ArrowLeftRight, Wallet } from 'lucide-react';

function BudgetFlowTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-ghost rounded-xl p-3 shadow-elevated">
      <p className="font-bold text-sm text-display">{formatCurrency(Math.abs(payload[0].value))}</p>
    </div>
  );
}

export default function InsightsPanel() {
  const { state } = useApp();

  const spendingByCategory = useMemo(() => {
    const map = {};
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [state.transactions]);

  const monthlySavings = useMemo(() => {
    const map = {};
    state.transactions.forEach(t => {
      const m = new Date(t.date).toLocaleString('en-US', { month: 'short' });
      if (!map[m]) map[m] = { month: m, income: 0, expenses: 0 };
      if (t.type === 'income') map[m].income += t.amount;
      else map[m].expenses += t.amount;
    });
    return Object.values(map).map(m => ({
      month: m.month,
      savings: Math.round(m.income - m.expenses),
    }));
  }, [state.transactions]);

  const totalExpenses = state.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = state.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const netCashflow = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? (netCashflow / totalIncome) * 100 : 0;
  const isNetPositive = netCashflow >= 0;
  const topCategory = spendingByCategory[0];

  const avgExpense = state.transactions.filter(t => t.type === 'expense').length > 0
    ? totalExpenses / state.transactions.filter(t => t.type === 'expense').length : 0;

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-extrabold font-headline text-display tracking-tight">Financial Intelligence</h2>
          <p className="text-sub text-xl font-medium mt-1">Curated analysis of your spending architecture.</p>
        </div>
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(state.transactions, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href = url; a.download = 'transactions.json'; a.click();
          }}
          className="px-6 py-2.5 gradient-cta text-white rounded-xl text-sm font-bold shadow-lg hover:scale-[1.02] transition-transform flex items-center gap-2"
          style={{ boxShadow: '0 4px 14px rgba(0,21,62,0.2)' }}
        >
          <DollarSign size={16} /> Download Archive
        </button>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Highest Spending Category */}
        <div className="col-span-12 md:col-span-4 bg-card p-8 rounded-xl relative overflow-hidden hover-lift animate-enter stagger-1 flex flex-col justify-center h-full">
          <div className="absolute -top-6 -right-10 opacity-[0.04] pointer-events-none">
            <Home size={240} strokeWidth={1.5} />
          </div>
          <div className="relative z-10 text-left">
            <span className="text-[14px] font-extrabold uppercase tracking-[0.15em] text-muted opacity-80 mb-5 block">Highest Spending Category</span>
            <h3 className="text-5xl font-black font-headline text-display">{topCategory?.name || '-'}</h3>
            <p className="text-5xl font-light text-sub mt-2">{formatCurrency(topCategory?.value || 0)}</p>
          </div>
          <div className="relative z-10 flex items-center gap-2 text-coral text-lg font-bold mt-10">
            <TrendingUp size={20} />
            <span>+{((topCategory?.value / totalExpenses) * 100 || 0).toFixed(1)}% of total</span>
          </div>
        </div>

        {/* Monthly Budget Flow Bar Chart */}
        <div className="col-span-12 md:col-span-8 bg-card p-8 rounded-xl hover-lift animate-enter stagger-2">
          <div className="flex justify-between items-start mb-8">
            <div>
              <span className="text-[14px] font-extrabold uppercase tracking-[0.15em] text-muted opacity-80">Monthly Comparison</span>
              <h3 className="text-3xl font-bold font-headline text-display">Budget Flow</h3>
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer>
              <BarChart data={monthlySavings} barCategoryGap="30%">
                <XAxis dataKey="month" tick={{ fontSize: 14, fontWeight: 800, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} tick={{ fontSize: 14, fontWeight: 700, fill: 'var(--text-tertiary)' }} axisLine={false} tickLine={false} width={56} />
                <Tooltip content={<BudgetFlowTooltip />} cursor={false} />
                <ReferenceLine y={0} stroke="var(--color-outline)" strokeOpacity={0.5} />
                <Bar dataKey="savings" radius={[6, 6, 0, 0]}>
                  {monthlySavings.map((entry, i) => (
                    <Cell key={i} fill={entry.savings >= 0 ? 'var(--color-emerald)' : 'var(--color-coral)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Savings Velocity */}
        <div className="col-span-12 md:col-span-5 bg-card p-8 rounded-xl flex flex-col justify-between animate-enter stagger-3">
          <div className="space-y-3">
            <span className="text-[14px] font-extrabold uppercase tracking-[0.15em] text-muted opacity-80">Savings Velocity</span>
            <div className="flex items-baseline gap-2">
              <h3 className="text-5xl font-black font-headline text-display">{savingsRate.toFixed(1)}%</h3>
              <span className="text-emerald font-bold text-sm">Target: 30%</span>
            </div>
            <div className="pt-4">
              <div className="h-3 w-full bg-inset rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((savingsRate / 30) * 100, 100)}%`, boxShadow: '0 0 20px rgba(0,108,73,0.3)' }}
                />
              </div>
              <div className="flex justify-between mt-3">
                <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted opacity-80">Current: {formatCurrency(netCashflow)}</span>
                <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-muted opacity-80">Goal: 30%</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-emerald/5 rounded-xl flex items-center gap-3 border border-emerald/10">
            <Target size={18} className="text-emerald shrink-0" />
            <p className="text-xs font-medium text-main">
              You are <span className="font-bold">{savingsRate >= 25 ? 'ahead of' : 'behind'}</span> your average savings trend.
            </p>
          </div>
        </div>

        {/* Insight CTA Card */}
        <div className="col-span-12 md:col-span-7 gradient-cta p-10 rounded-xl text-white flex items-center justify-between shadow-2xl animate-enter stagger-4"
          style={{ boxShadow: '0 12px 40px rgba(0,21,62,0.3)' }}>
          <div className="space-y-4 max-w-[60%]">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
              <Lightbulb size={20} />
            </div>
            <h3 className="text-2xl font-bold font-headline leading-tight">
              Your top spending category accounts for {((topCategory?.value / totalExpenses) * 100 || 0).toFixed(0)}% of total expenses.
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">
              Consider reviewing your {topCategory?.name || ''} expenses to optimize your budget allocation and boost your savings rate.
            </p>
          </div>
          <div className="hidden lg:block relative">
            <div className="w-28 h-28 rounded-full border-[8px] border-white/5 border-t-emerald-bright relative flex items-center justify-center">
              <span className="text-xl font-black font-headline">{savingsRate.toFixed(0)}%</span>
            </div>
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-black uppercase tracking-[.2em] bg-white text-ink px-3 py-1 rounded-full shadow-lg">
              Efficiency
            </span>
          </div>
        </div>

        {/* Top Spending Bars */}
        <div className="col-span-12 md:col-span-8 bg-card rounded-xl p-8 animate-enter">
          <h3 className="font-headline text-2xl font-extrabold text-display mb-6">Spending Concentration</h3>
          <div className="space-y-5">
            {spendingByCategory.map((cat, i) => {
              const pct = (cat.value / totalExpenses) * 100;
              const fallbackColors = ['var(--color-ink)', 'var(--color-ink-soft)', 'var(--color-emerald)', 'var(--color-coral)', 'var(--color-amber)', 'var(--color-ink-lighter)'];
              const barColor = CATEGORY_COLORS[cat.name] || fallbackColors[i % fallbackColors.length];
              return (
                <div key={cat.name}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: barColor }} />
                      <span className="text-sm font-semibold text-main">{cat.name}</span>
                    </div>
                    <span className="text-sm font-bold text-main">{pct.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-inset rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stacked Micro Insights */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6 h-full">
          {[
            {
              icon: Repeat,
              label: 'Recurring',
              title: `${state.transactions.filter(t => ['Netflix Subscription', 'Spotify Premium', 'Gym Membership', 'Zomato Pro', 'Airtel Broadband'].includes(t.description)).length} Subscriptions Tracked`,
              color: 'text-display',
              iconShell: 'bg-ink/20 border-ink/20',
              iconTone: 'text-display',
            },
            {
              icon: ArrowLeftRight,
              label: 'Cashflow',
              title: `${isNetPositive ? 'Positive' : 'Negative'} ${formatCurrency(Math.abs(netCashflow))}`,
              color: isNetPositive ? 'text-emerald' : 'text-coral',
              iconShell: isNetPositive ? 'bg-emerald/20 border-emerald/30' : 'bg-coral/20 border-coral/30',
              iconTone: isNetPositive ? 'text-emerald' : 'text-coral',
            },
            {
              icon: Wallet,
              label: 'Average Expense',
              title: formatCurrency(avgExpense),
              color: 'text-display',
              iconShell: 'bg-ink/20 border-ink/20',
              iconTone: 'text-display',
            },
            ].map((item, i) => {
              const MetricIcon = item.icon;
              return (
                <div key={i} className="flex-1 p-6 bg-card shadow-ambient rounded-xl border border-transparent hover:border-subtle hover:bg-section hover:-translate-y-1 hover:shadow-elevated transition-all duration-300 flex items-center gap-5 animate-enter">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 shadow-inner ${item.iconShell}`}>
                    <MetricIcon size={20} className={item.iconTone} />
                  </div>
                  <div>
                    <p className="text-[14px] font-extrabold uppercase tracking-[0.15em] text-muted opacity-80">{item.label}</p>
                    <p className={`text-[22px] font-bold leading-tight mt-1 ${item.color}`}>{item.title}</p>
                  </div>
              </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
