import { useMemo, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatShortDate } from '../../utils/formatters';

const INITIAL_BALANCE = 10000;

function toIsoDate(date) {
  return date.toISOString().split('T')[0];
}

function BalanceTrendTooltip({ active, payload, formatTooltipDate }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-ghost rounded-xl p-3 shadow-elevated">
      <p className="label-micro text-xs mb-1">{formatTooltipDate(payload[0].payload.date)}</p>
      <p className="font-headline font-extrabold text-base text-display">{formatCurrency(payload[0].value)}</p>
    </div>
  );
}

export default function BalanceTrend() {
  const { state } = useApp();
  const [period, setPeriod] = useState('6m');

  const data = useMemo(() => {
    const sorted = [...state.transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    if (!sorted.length) return [];

    const endDate = new Date(`${sorted[sorted.length - 1].date}T00:00:00`);
    const daysInRange = period === '1y' ? 365 : 180;
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - (daysInRange - 1));

    const startKey = toIsoDate(startDate);
    const endKey = toIsoDate(endDate);
    const deltaByDate = {};
    let runningBalance = INITIAL_BALANCE;

    sorted.forEach(transaction => {
      const delta = transaction.type === 'income' ? transaction.amount : -transaction.amount;
      if (transaction.date < startKey) {
        runningBalance += delta;
        return;
      }
      if (transaction.date > endKey) return;
      deltaByDate[transaction.date] = (deltaByDate[transaction.date] || 0) + delta;
    });

    const dailyPoints = [];
    const cursor = new Date(startDate);

    while (cursor <= endDate) {
      const dateKey = toIsoDate(cursor);
      runningBalance += deltaByDate[dateKey] || 0;
      dailyPoints.push({
        date: dateKey,
        balance: Math.round(runningBalance * 100) / 100,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    if (period === '6m') return dailyPoints;

    // For 1Y view, keep month-end balances for a cleaner long-range trend.
    const monthEndPoints = [];
    dailyPoints.forEach(point => {
      const monthKey = point.date.slice(0, 7);
      const lastPoint = monthEndPoints[monthEndPoints.length - 1];
      if (!lastPoint || lastPoint.monthKey !== monthKey) {
        monthEndPoints.push({ ...point, monthKey });
      } else {
        monthEndPoints[monthEndPoints.length - 1] = { ...point, monthKey };
      }
    });

    return monthEndPoints.map((point) => ({ date: point.date, balance: point.balance }));
  }, [state.transactions, period]);

  const subtitle = period === '6m' ? 'Capital accumulation over 180 days' : 'Capital accumulation over 1 year';

  const formatAxisDate = dateString => {
    if (period === '1y') {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short' });
    }
    return formatShortDate(dateString);
  };

  const formatTooltipDate = dateString => {
    if (period === '1y') {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }
    return formatShortDate(dateString);
  };

  return (
    <div className="bg-card p-8 rounded-xl hover-lift animate-enter stagger-2">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-bold font-headline text-display tracking-tight">Balance Structural Trend</h3>
          <p className="text-xs text-sub mt-0.5">{subtitle}</p>
        </div>
        <div className="flex gap-2">
          {['6m', '1y'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${
                period === p ? 'bg-card shadow-ambient text-display' : 'text-muted hover:bg-card/50'
              }`}
            >
              {p === '6m' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 14, right: 20, bottom: 16, left: 16 }}>
            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="var(--border-chart-grid)" />
            <defs>
              <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-ink)" stopOpacity={0.12} />
                <stop offset="100%" stopColor="var(--color-ink)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tickFormatter={formatAxisDate}
              tick={{ fontSize: 13, fontWeight: 800, fill: 'var(--text-tertiary)', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={period === '1y' ? 28 : 60}
              tickMargin={10}
              height={32}
              padding={{ left: 8, right: 8 }}
            />
            <YAxis
              tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`}
              tick={{ fontSize: 13, fontWeight: 600, fill: 'var(--text-tertiary)', fontFamily: 'Inter' }}
              axisLine={false}
              tickLine={false}
              width={56}
              tickMargin={8}
              tickCount={5}
            />
            <Tooltip content={<BalanceTrendTooltip formatTooltipDate={formatTooltipDate} />} />
            <Area
              animationDuration={1500}
              animationEasing="ease-out"
              type="monotone"
              dataKey="balance"
              stroke="var(--color-ink)"
              strokeWidth={2.5}
              fill="url(#balanceGrad)"
              dot={false}
              activeDot={{ r: 6, fill: 'var(--color-ink)', strokeWidth: 0, className: 'animate-scale-in' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
