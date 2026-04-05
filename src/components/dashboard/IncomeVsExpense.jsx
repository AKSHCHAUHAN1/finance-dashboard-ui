import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency } from '../../utils/formatters';

function IncomeExpenseTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-ghost rounded-xl p-4 shadow-elevated">
      <p className="label-micro text-xs mb-2">{label}</p>
      {payload.map((point) => (
        <div key={point.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: point.color }} />
          <span className="text-sm text-sub">{point.name}:</span>
          <span className="text-sm font-bold text-display">{formatCurrency(point.value)}</span>
        </div>
      ))}
    </div>
  );
}

function IncomeExpenseLegend({ payload }) {
  return (
    <div className="flex justify-center gap-6 mt-2">
      {payload?.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: entry.color }} />
          <span className="text-xs font-bold text-sub">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function IncomeVsExpense() {
  const { state } = useApp();

  const data = useMemo(() => {
    const map = {};
    state.transactions.forEach(t => {
      const m = new Date(t.date).toLocaleString('en-US', { month: 'short' });
      if (!map[m]) map[m] = { month: m, income: 0, expenses: 0 };
      if (t.type === 'income') map[m].income += t.amount;
      else map[m].expenses += t.amount;
    });
    return Object.values(map).map(m => ({
      ...m,
      income: Math.round(m.income),
      expenses: Math.round(m.expenses),
    }));
  }, [state.transactions]);

  return (
    <div className="bg-card p-8 rounded-xl hover-lift animate-enter stagger-4">
      <h3 className="text-xl font-bold font-headline text-display tracking-tight mb-1">Income vs Expenses</h3>
      <p className="text-xs text-sub mb-6">Monthly cash flow comparison</p>
      <div className="h-64">
        <ResponsiveContainer>
          <BarChart data={data} barGap={4} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--border-chart-grid)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 13, fontWeight: 800, fill: 'var(--text-tertiary)', fontFamily: 'Inter' }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
              tick={{ fontSize: 13, fontWeight: 600, fill: 'var(--text-tertiary)', fontFamily: 'Inter' }}
              axisLine={false} tickLine={false} width={50}
            />
            <Tooltip content={<IncomeExpenseTooltip />} cursor={false} />
            <Legend content={<IncomeExpenseLegend />} />
            <Bar animationDuration={1200} animationEasing="ease-out" dataKey="expenses" name="Expenses" fill="var(--color-ink)" radius={[4, 4, 0, 0]} />
            <Bar animationDuration={1200} animationEasing="ease-out" dataKey="income" name="Income" fill="var(--color-emerald)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
