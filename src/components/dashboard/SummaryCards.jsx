import { useApp } from '../../context/AppContext';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { calculateSummary } from '../../utils/calculations';
import { TrendingUp, TrendingDown, Wallet, ArrowDownLeft, ArrowUpRight, Target } from 'lucide-react';

export default function SummaryCards() {
  const { state } = useApp();
  const summary = calculateSummary(state.transactions);

  const cards = [
    {
      label: 'Total Liquidity',
      value: formatCurrency(summary.totalBalance),
      trend: summary.balanceTrend,
      icon: Wallet,
      iconTone: 'text-muted opacity-30',
      accent: 'ink',
      sub: (
        <div className="mt-6">
          <div className="h-1.5 w-full bg-section rounded-full overflow-hidden">
            <div className="h-full rounded-full gradient-cta transition-all duration-700" style={{ width: `${Math.min((summary.totalBalance / 30000) * 100, 100)}%` }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="label-micro text-[10px]">Goal Progress</span>
            <span className="label-micro text-[10px]">₹30,000 Target</span>
          </div>
        </div>
      ),
    },
    {
      label: 'Active Revenue',
      value: formatCurrency(summary.totalIncome),
      trend: summary.incomeTrend,
      icon: ArrowDownLeft,
      iconTone: 'text-emerald',
      accent: 'emerald',
      sub: (
        <div className="mt-5 flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-10">
            {[40, 60, 35, 80, 50, 90].map((h, i) => (
              <div key={i} className="w-3 rounded-t-sm transition-all bg-emerald" style={{ height: `${h}%`, opacity: 0.15 + (i * 0.15) }} />
            ))}
          </div>
          <span className="label-micro text-[10px]">Growth vs Prev Month</span>
        </div>
      ),
    },
    {
      label: 'Operational Cost',
      value: formatCurrency(summary.totalExpenses),
      trend: summary.expenseTrend,
      trendInvert: true,
      icon: ArrowUpRight,
      iconTone: 'text-coral',
      accent: 'coral',
      sub: (
        <div className="mt-5">
          <div className="flex justify-between items-end gap-0.5 h-10">
            {[45, 65, 30, 85, 55, 25, 40].map((h, i) => (
              <div key={i} className="w-full rounded-t-sm transition-all" style={{
                height: `${h}%`,
                backgroundColor: h > 70 ? 'var(--color-coral)' : 'var(--bg-inset)',
                opacity: h > 70 ? 0.5 : 1,
              }} />
            ))}
          </div>
          <div className="label-micro text-[10px] mt-2 text-center">Weekly Burn Rate</div>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        const isPositive = card.trendInvert ? card.trend < 0 : card.trend > 0;
        return (
          <div key={idx} className={`bg-card p-8 rounded-xl relative overflow-hidden hover-lift animate-enter stagger-${idx + 1}`}>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-5">
                <span className="label-micro">{card.label}</span>
                <Icon size={20} className={card.iconTone} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold font-headline text-display tracking-tighter">{card.value}</span>
                {card.trend !== undefined && (
                  <span className={`flex items-center gap-0.5 text-[10px] font-bold ${isPositive ? 'text-emerald' : 'text-coral'}`}>
                    {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {formatPercent(Math.abs(card.trend))}
                  </span>
                )}
              </div>
              {card.sub}
            </div>
            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-5 bg-${card.accent}`} />
          </div>
        );
      })}
    </div>
  );
}
