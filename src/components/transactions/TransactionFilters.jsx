import { useApp } from '../../context/AppContext';
import { Filter, Search } from 'lucide-react';
import { ALL_CATEGORIES } from '../../data/mockData';
import SelectMenu from '../common/SelectMenu';

export default function TransactionFilters() {
  const { state, dispatch } = useApp();

  const setFilter = (key, value) => dispatch({ type: 'SET_FILTERS', payload: { ...state.filters, [key]: value } });
  const categoryOptions = [...new Set(ALL_CATEGORIES)];

  return (
    <div className="space-y-4 animate-scale-in relative z-[60]">
      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between p-4 lg:p-5 bg-card/50 border-b border-ghost gap-4 lg:gap-0">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Animated Premium Search Bar */}
          <div className="relative group">
            <Search size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10 transition-all duration-400 ease-out group-focus-within:scale-110 group-focus-within:text-main" />
            <input
              type="text"
              placeholder="Search..."
              value={state.filters.search || ''}
              onChange={e => setFilter('search', e.target.value)}
              className="w-full sm:w-48 xl:w-56 bg-app border border-transparent rounded-lg pl-10 pr-4 py-2 text-sm font-semibold text-main placeholder:text-muted focus:bg-card focus:border-subtle focus:shadow-ambient sm:focus:w-56 xl:focus:w-72 hover:bg-inset transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] outline-none"
            />
          </div>

          <div className="relative w-[180px]">
            <Filter size={15} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted z-10" />
            <SelectMenu
              value={state.filters.category || ''}
              onChange={val => setFilter('category', val)}
              options={categoryOptions}
              placeholder="Filter by Category"
              className="w-full bg-app border-none rounded-lg pl-10 pr-4 py-2 text-sm font-semibold text-sub cursor-pointer hover:bg-inset transition-colors outline-none"
            />
          </div>

          <div className="w-[120px]">
            <SelectMenu
              value={state.filters.type || ''}
              onChange={val => setFilter('type', val)}
              options={[{ value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }]}
              placeholder="All Types"
              className="bg-app border border-transparent rounded-lg px-4 py-2 text-sm font-semibold text-sub cursor-pointer hover:bg-inset hover:border-ghost transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2 group">
            <input
              type="date"
              value={state.filters.startDate || ''}
              onChange={e => setFilter('startDate', e.target.value)}
              className="bg-app border border-transparent rounded-lg px-4 py-2 text-sm text-sub focus:border-subtle focus:bg-card focus:shadow-ambient hover:bg-inset hover:border-ghost transition-all outline-none"
            />
            <span className="text-muted text-xs font-bold px-1 text-opacity-50">-</span>
            <input
              type="date"
              value={state.filters.endDate || ''}
              onChange={e => setFilter('endDate', e.target.value)}
              className="bg-app border border-transparent rounded-lg px-4 py-2 text-sm text-sub focus:border-subtle focus:bg-card focus:shadow-ambient hover:bg-inset hover:border-ghost transition-all outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 lg:pr-4 w-full lg:w-auto mt-4 lg:mt-0 justify-between lg:justify-end">
          <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-muted whitespace-nowrap">
            Displaying 1-{Math.min(state.filters.perPage || 10, state.transactions.length)} of {state.transactions.length}
          </span>
          <div className="w-[160px]">
            <SelectMenu
              value={state.filters.sortBy || 'date-desc'}
              onChange={val => setFilter('sortBy', val)}
              options={[
                { value: 'date-desc', label: 'Newest First' },
                { value: 'date-asc', label: 'Oldest First' },
                { value: 'amount-desc', label: 'Highest Amount' },
                { value: 'amount-asc', label: 'Lowest Amount' }
              ]}
              placeholder=""
              className="bg-app border border-transparent rounded-lg px-4 py-2.5 text-xs font-bold text-main uppercase tracking-wider hover:bg-inset hover:border-ghost transition-all outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
