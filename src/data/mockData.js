const categories = {
  income: ['Salary', 'Freelance', 'Investment', 'Refund', 'Other'],
  expense: ['Housing', 'Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Bills & Utilities', 'Healthcare', 'Education', 'Travel', 'Other'],
};
const descriptions = {
  'Salary': ['Monthly Salary - Tech Corp', 'Salary - InnovateSpace'],
  'Freelance': ['Upwork Web Project', 'Consulting - Local Business', 'Fiverr Gigs'],
  'Investment': ['Mutual Fund SIP Return', 'FD Interest', 'Dividend - ITC'],
  'Refund': ['Amazon Refund', 'IRCTC Refund', 'Swiggy Refund', 'Tax Refund'],
  'Housing': ['House Rent', 'Maintenance Charges', 'Property Tax'],
  'Food & Dining': ['Zomato Order', 'Swiggy Delivery', 'Starbucks', 'Local Biryani Point', 'D-Mart Groceries', 'Blinkit Delivery'],
  'Shopping': ['Amazon.in Order', 'Myntra Clothes', 'Flipkart Electronics', 'Croma', 'Shoppers Stop'],
  'Transport': ['Uber Ride', 'Ola Cab', 'Metro Smartcard Recharge', 'Indian Oil Petrol', 'HP Petrol Pump'],
  'Entertainment': ['BookMyShow', 'Netflix India', 'Spotify Premium', 'Prime Video', 'PVR Cinemas'],
  'Bills & Utilities': ['Jio Postpaid/Recharge', 'Airtel Xstream Fiber', 'Electricity Bill - BESCOM', 'Mahanagar Gas', 'Water Bill'],
  'Healthcare': ['Apollo Pharmacy', 'Practo Consultation', 'Cult.fit Membership', '1mg Order'],
  'Education': ['Udemy Course', 'Coursera Subscription', 'Books from Amazon', 'Certification Exam'],
  'Travel': ['MakeMyTrip Flight', 'Airbnb Booking', 'IRCTC Train Ticket', 'Oyo Rooms'],
  'Other': ['Misc Transfer', 'Cash Withdrawal', 'UPI Payment', 'Unknown Charge']
};
const icons = {
  'Salary': 'payments', 'Freelance': 'code', 'Investment': 'trending_up', 'Refund': 'undo',
  'Housing': 'home', 'Food & Dining': 'restaurant', 'Shopping': 'shopping_bag', 'Transport': 'directions_car',
  'Entertainment': 'movie', 'Bills & Utilities': 'bolt', 'Healthcare': 'favorite', 'Education': 'school', 'Travel': 'flight',
  'Other': 'category'
};
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rand(min, max) { return Math.round((Math.random() * (max - min) + min) * 100) / 100; }
function id() { return 'txn_' + Math.random().toString(36).substr(2, 9); }

function generate() {
  const txns = [];
  const now = new Date();
  for (let m = 0; m < 6; m++) {
    const yr = now.getFullYear(), mo = now.getMonth() - m;
    const d = new Date(yr, mo, 1);
    
    // Fixed monthly expenses
    txns.push({ id: id(), date: new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0], description: pick(descriptions['Salary']), amount: rand(82000, 88000), category: 'Salary', type: 'income', status: 'completed' });
    txns.push({ id: id(), date: new Date(d.getFullYear(), d.getMonth(), 3).toISOString().split('T')[0], description: 'House Rent', amount: 22000, category: 'Housing', type: 'expense', status: 'completed' });
    txns.push({ id: id(), date: new Date(d.getFullYear(), d.getMonth(), 5).toISOString().split('T')[0], description: 'Electricity Bill', amount: rand(1200, 2500), category: 'Bills & Utilities', type: 'expense', status: 'completed' });
    txns.push({ id: id(), date: new Date(d.getFullYear(), d.getMonth(), 5).toISOString().split('T')[0], description: 'Airtel Xstream Fiber', amount: 943, category: 'Bills & Utilities', type: 'expense', status: 'completed' });

    if (Math.random() > 0.6) {
      const c = pick(['Freelance', 'Investment', 'Refund']);
      txns.push({ id: id(), date: new Date(d.getFullYear(), d.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0], description: pick(descriptions[c]), amount: c === 'Refund' ? rand(500, 2000) : rand(5000, 15000), category: c, type: 'income', status: 'completed' });
    }
    
    const n = Math.floor(Math.random() * 12) + 15; // 15-27 random transactions per month
    for (let i = 0; i < n; i++) {
      const c = pick(categories.expense.filter(cat => cat !== 'Housing')); // Skip housing, done above
      const ranges = { 'Food & Dining': [150, 2500], 'Shopping': [500, 8000], 'Transport': [100, 1500], 'Entertainment': [200, 1500], 'Bills & Utilities': [199, 800], 'Healthcare': [300, 3000], 'Education': [499, 4500], 'Travel': [2000, 12000], 'Other': [100, 5000] };
      const [min, max] = ranges[c];
      txns.push({ id: id(), date: new Date(d.getFullYear(), d.getMonth(), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0], description: pick(descriptions[c]), amount: rand(min, max), category: c, type: 'expense', status: Math.random() > 0.05 ? 'completed' : 'pending' });
    }
  }
  txns.sort((a, b) => new Date(b.date) - new Date(a.date));
  return txns;
}

export const MOCK_TRANSACTIONS = generate();
export const CATEGORY_ICONS = icons;
export const CATEGORY_COLORS = {
  'Salary': 'var(--color-emerald)', 'Freelance': 'var(--color-emerald-light)', 'Investment': 'var(--color-ink-soft)', 'Refund': 'var(--color-ink-tint)', 'Other': 'var(--color-outline)',
  'Housing': 'var(--color-ink-light)', 'Food & Dining': 'var(--color-coral)', 'Shopping': 'var(--color-coral-soft)', 'Transport': 'var(--color-ink-soft)',
  'Entertainment': 'var(--color-amber)', 'Bills & Utilities': 'var(--color-emerald)', 'Healthcare': 'var(--color-cyan)', 'Education': 'var(--color-ink-light)', 'Travel': 'var(--color-emerald-bright)',
};
export const ALL_CATEGORIES = [...categories.income, ...categories.expense];
export const EXPENSE_CATEGORIES = categories.expense;
export const INCOME_CATEGORIES = categories.income;
