import { NavLink, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Settings, Plus, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { path: '/insights', label: 'Insights', icon: Lightbulb },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ onAddTransaction, collapsed, setCollapsed }) {
  const { state } = useApp();
  const location = useLocation();

  const textClass = `whitespace-nowrap overflow-hidden transition-all duration-300 ${
    collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
  }`;

  return (
    <aside className={`flex flex-col fixed left-0 top-0 h-full bg-sidebar-theme z-50 transition-all duration-300 overflow-hidden border-r border-subtle ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Brand */}
      <div className="py-8 px-4 transition-all duration-300">
        <div className={`flex items-center transition-all duration-300 ${collapsed ? 'justify-center' : 'gap-3 px-2'}`}>
          <div className={`rounded-xl gradient-cta flex items-center justify-center shrink-0 transition-all duration-300 ${collapsed ? 'w-12 h-12' : 'w-8 h-8'}`}>
            <span className="text-white font-headline font-extrabold text-sm">L</span>
          </div>
          <div className={textClass}>
            <div className="text-xl font-extrabold tracking-tight text-display font-headline">The Ledger</div>
            <div className="label-micro mt-0.5 text-[10px]">Wealth Portfolio</div>
          </div>
        </div>
      </div>

      {/* New Transaction CTA */}
      {state.role === 'admin' && (
        <div className="mb-6 px-4 transition-all duration-300">
          <button
            onClick={onAddTransaction}
            className={`gradient-cta text-white rounded-xl flex items-center justify-center gap-2 shadow-lg hover:opacity-90 hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 ${collapsed ? 'w-12 h-12 mx-auto p-0' : 'w-full py-3 px-4'}`}
            style={{ boxShadow: '0 4px 14px rgba(0,21,62,0.2)' }}
          >
            <Plus size={16} strokeWidth={2.5} className="shrink-0" />
            <span className={textClass}>
              <span className="text-sm font-bold">New Transaction</span>
            </span>
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          const NavIcon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl transition-all duration-300 group relative overflow-hidden border
                ${active
                  ? 'text-display font-bold bg-card shadow-elevated border-ink/10'
                  : 'text-muted hover:text-display hover:bg-card/50 border-transparent'
                }
                ${collapsed ? 'justify-center w-12 h-12 mx-auto p-0' : 'px-4 py-3'}
              `}
            >
              <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-ink rounded-l-full transition-transform duration-300 ${active ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'}`} />
              <NavIcon size={20} strokeWidth={active ? 2.2 : 1.8} className="shrink-0 relative z-10" />
              <span className={`text-sm font-semibold relative z-10 ${textClass}`}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 mt-auto transition-all duration-300">
        <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'max-h-0 opacity-0' : 'max-h-24 opacity-100'}`}>
          <div className="bg-section rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-white font-bold text-sm shrink-0">
                AC
              </div>
              <div className="min-w-0 whitespace-nowrap overflow-hidden">
                <div className="text-sm font-bold text-main truncate">Aksh Chauhan</div>
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted font-bold">
                  {state.role === 'admin' ? 'Admin Level' : 'Viewer Level'}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Collapsed avatar */}
        <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="w-12 h-12 mx-auto rounded-xl gradient-cta flex items-center justify-center text-white font-bold text-sm">
            AC
          </div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`mt-3 flex items-center justify-center gap-2 rounded-xl text-muted hover:text-display hover:bg-card transition-all duration-300 ${collapsed ? 'w-12 h-12 mx-auto p-0' : 'w-full py-2'}`}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          <span className={`text-xs font-medium ${textClass}`}>Collapse</span>
        </button>
      </div>
    </aside>
  );
}
