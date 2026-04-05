// Aggregate calculations for dashboard insights

export function calculateTotals(transactions) {
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  return { income, expenses, balance, savingsRate };
}

export function getMonthlyData(transactions) {
  const monthly = {};

  transactions.forEach(t => {
    const key = t.date.substring(0, 7); // YYYY-MM
    if (!monthly[key]) {
      monthly[key] = { month: key, income: 0, expenses: 0 };
    }
    if (t.type === 'income') {
      monthly[key].income += t.amount;
    } else {
      monthly[key].expenses += t.amount;
    }
  });

  return Object.values(monthly)
    .sort((a, b) => a.month.localeCompare(b.month))
    .map(m => ({
      ...m,
      balance: m.income - m.expenses,
      net: m.income - m.expenses,
    }));
}

export function getCategoryBreakdown(transactions, type = 'expense') {
  const breakdown = {};

  transactions
    .filter(t => t.type === type)
    .forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = 0;
      }
      breakdown[t.category] += t.amount;
    });

  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);

  return Object.entries(breakdown)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      percentage: total > 0 ? Math.round((value / total) * 1000) / 10 : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

export function getBalanceTrend(transactions) {
  // Group by date, compute cumulative balance
  const dailyMap = {};

  // Sort transactions by date ascending
  const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  sorted.forEach(t => {
    if (!dailyMap[t.date]) {
      dailyMap[t.date] = 0;
    }
    if (t.type === 'income') {
      dailyMap[t.date] += t.amount;
    } else {
      dailyMap[t.date] -= t.amount;
    }
  });

  let cumulative = 10000; // Starting balance
  return Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, net]) => {
      cumulative += net;
      return {
        date,
        balance: Math.round(cumulative * 100) / 100,
      };
    });
}

export function getInsights(transactions) {
  const now = new Date();
  const currentMonth = now.toISOString().substring(0, 7);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().substring(0, 7);

  const currentMonthTxns = transactions.filter(t => t.date.startsWith(currentMonth));
  const lastMonthTxns = transactions.filter(t => t.date.startsWith(lastMonth));

  const currentExpenses = currentMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const lastExpenses = lastMonthTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const currentIncome = currentMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const lastIncome = lastMonthTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  // Highest spending category
  const categoryBreakdown = getCategoryBreakdown(transactions, 'expense');
  const highestCategory = categoryBreakdown.length > 0 ? categoryBreakdown[0] : null;

  // Largest single expense
  const expenses = transactions.filter(t => t.type === 'expense');
  const largestExpense = expenses.length > 0
    ? expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0])
    : null;

  // Average transactions
  const avgExpense = expenses.length > 0
    ? expenses.reduce((s, t) => s + t.amount, 0) / expenses.length
    : 0;

  const incomes = transactions.filter(t => t.type === 'income');
  const avgIncome = incomes.length > 0
    ? incomes.reduce((s, t) => s + t.amount, 0) / incomes.length
    : 0;

  // Monthly comparison
  const expenseChange = lastExpenses > 0
    ? ((currentExpenses - lastExpenses) / lastExpenses) * 100
    : 0;
  const incomeChange = lastIncome > 0
    ? ((currentIncome - lastIncome) / lastIncome) * 100
    : 0;

  // Daily spending average (current month)
  const daysInCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const dailySpending = currentExpenses / Math.min(now.getDate(), daysInCurrentMonth);

  // Total transactions count
  const transactionCount = transactions.length;

  return {
    highestCategory,
    largestExpense,
    avgExpense: Math.round(avgExpense * 100) / 100,
    avgIncome: Math.round(avgIncome * 100) / 100,
    currentExpenses: Math.round(currentExpenses * 100) / 100,
    lastExpenses: Math.round(lastExpenses * 100) / 100,
    currentIncome: Math.round(currentIncome * 100) / 100,
    lastIncome: Math.round(lastIncome * 100) / 100,
    expenseChange: Math.round(expenseChange * 10) / 10,
    incomeChange: Math.round(incomeChange * 10) / 10,
    dailySpending: Math.round(dailySpending * 100) / 100,
    transactionCount,
  };
}

// Get previous month totals for comparison indicators on summary cards
export function getPreviousMonthComparison(transactions) {
  const now = new Date();
  const currentMonth = now.toISOString().substring(0, 7);
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().substring(0, 7);

  const current = calculateTotals(transactions.filter(t => t.date.startsWith(currentMonth)));
  const previous = calculateTotals(transactions.filter(t => t.date.startsWith(lastMonth)));

  return {
    incomeChange: previous.income > 0 ? ((current.income - previous.income) / previous.income) * 100 : 0,
    expenseChange: previous.expenses > 0 ? ((current.expenses - previous.expenses) / previous.expenses) * 100 : 0,
    balanceChange: previous.balance !== 0 ? ((current.balance - previous.balance) / Math.abs(previous.balance)) * 100 : 0,
    savingsChange: current.savingsRate - previous.savingsRate,
  };
}

// Combined summary for dashboard cards
export function calculateSummary(transactions) {
  const totals = calculateTotals(transactions);
  const comparison = getPreviousMonthComparison(transactions);

  return {
    totalBalance: totals.balance,
    totalIncome: totals.income,
    totalExpenses: totals.expenses,
    savingsRate: totals.savingsRate,
    balanceTrend: comparison.balanceChange,
    incomeTrend: comparison.incomeChange,
    expenseTrend: comparison.expenseChange,
    savingsTrend: comparison.savingsChange,
  };
}
