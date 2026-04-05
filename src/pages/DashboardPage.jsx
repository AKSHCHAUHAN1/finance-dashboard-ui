import SummaryCards from '../components/dashboard/SummaryCards';
import BalanceTrend from '../components/dashboard/BalanceTrend';
import SpendingBreakdown from '../components/dashboard/SpendingBreakdown';
import IncomeVsExpense from '../components/dashboard/IncomeVsExpense';
import RecentTransactions from '../components/dashboard/RecentTransactions';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="mb-2">
        <h1 className="text-4xl font-extrabold font-headline text-display tracking-tight">Dashboard</h1>
        <p className="text-sub font-medium mt-1">Welcome back! Here's your financial overview.</p>
      </div>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BalanceTrend />
        <SpendingBreakdown />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeVsExpense />
        <RecentTransactions />
      </div>
    </div>
  );
}
