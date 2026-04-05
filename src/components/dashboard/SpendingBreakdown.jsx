import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatCompactCurrency } from '../../utils/formatters';
import { CATEGORY_COLORS } from '../../data/mockData';

const COLORS = ['var(--color-ink)', 'var(--color-emerald)', 'var(--color-ink-soft)', 'var(--color-coral-light)', 'var(--color-amber)', 'var(--color-cyan)', 'var(--color-azure)', 'var(--color-teal)', 'var(--color-coral)'];

function SpendingTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const datum = payload[0].payload;
  return (
    <div className="bg-card border border-ghost rounded-2xl p-5 shadow-dramatic min-w-[180px]">
      <h4 className="font-headline font-bold text-lg text-display mb-1">{datum.name}</h4>
      <p className="text-base text-main mb-0.5">{formatCurrency(datum.value)}</p>
      <p className="text-sm text-muted">{datum.percent.toFixed(1)}% of total</p>
    </div>
  );
}

export default function SpendingBreakdown() {
  const { state } = useApp();

  const data = useMemo(() => {
    const map = {};
    state.transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    const total = Object.values(map).reduce((s, v) => s + v, 0);
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100, percent: (value / total) * 100 }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [state.transactions]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="bg-card p-8 rounded-xl hover-lift animate-enter stagger-3">
      <h3 className="text-xl font-bold font-headline text-display tracking-tight mb-6">Spending Breakdown</h3>

      <div className="flex items-center gap-8">
        <div className="relative flex justify-center shrink-0">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Tooltip content={<SpendingTooltip />} cursor={false} wrapperStyle={{ zIndex: 100 }} />
              <Pie 
                data={data} 
                cx="50%" 
                cy="50%" 
                innerRadius={65} 
                outerRadius={90} 
                paddingAngle={2} 
                dataKey="value" 
                strokeWidth={0}
              >
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} className="hover:opacity-80 transition-opacity duration-200 cursor-pointer" />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
            <span className="text-xl font-extrabold font-headline text-display tracking-tight">{formatCompactCurrency(total)}</span>
            <span className="label-micro text-[10px] mt-0.5">Spent</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4 flex-1">
          {data.map((item, i) => (
            <div key={item.name} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-xs font-semibold text-main truncate">{item.name}</span>
              </div>
              <span className="text-[11px] font-bold text-muted">{item.percent.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
