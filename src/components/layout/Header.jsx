import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Bell, Sun, Moon, X, CheckCircle } from 'lucide-react';

export default function Header() {
  const { state, dispatch } = useApp();
  const isAdmin = state.role === 'admin';

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "System update completed successfully.", time: "2m ago" },
    { id: 2, text: "New login from unknown device. Please review.", time: "1h ago" },
    { id: 3, text: "Monthly expense report is ready to download.", time: "3h ago" }
  ]);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex justify-between items-center w-full px-8 py-5 sticky top-0 z-40 bg-glass border-b border-subtle">
      {/* Search */}
      <div className="flex items-center gap-6 flex-1">
        <div className="relative w-full max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-inset border-none rounded-full pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-ink/40 focus:bg-card transition-all text-main placeholder:text-muted font-body outline-none"
          />
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Action Icons */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-11 h-11 rounded-xl flex items-center justify-center text-muted hover:text-ink hover:bg-ink-tint transition-all duration-300 relative"
          >
            <Bell size={20} />
            {notifications.length > 0 && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full gradient-cta border-[1.5px] border-card animate-pulse shadow-[0_0_8px_var(--color-ink)]"></span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-14 left-1/2 -translate-x-1/2 w-80 bg-card rounded-2xl shadow-dramatic border border-ghost overflow-hidden animate-scale-in z-50 origin-top">
              <div className="p-4 border-b border-subtle flex items-center justify-between bg-section/50">
                <h3 className="font-headline font-bold text-sm text-display">Notifications</h3>
                {notifications.length > 0 && (
                  <button 
                    onClick={() => setNotifications([])}
                    className="text-[10px] uppercase tracking-wider font-extrabold text-muted hover:text-coral transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center flex flex-col items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-section flex items-center justify-center text-emerald">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-display">All caught up</p>
                      <p className="text-xs text-muted mt-0.5">You have no new notifications.</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col relative w-full">
                    {notifications.map((notif, i) => (
                      <div key={notif.id} className="relative group">
                        <div className="p-4 hover:bg-section transition-colors flex items-start gap-3 relative cursor-pointer z-10 w-full bg-card group-hover:bg-section">
                          <div className="w-2 h-2 rounded-full gradient-cta mt-1.5 shrink-0 shadow-[0_0_8px_var(--color-ink)]" />
                          <div className="flex-1 min-w-0 pr-6">
                            <p className="text-sm text-main font-medium leading-snug">{notif.text}</p>
                            <p className="text-xs text-muted mt-1 font-semibold opacity-70">{notif.time}</p>
                          </div>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setNotifications(notifications.filter(n => n.id !== notif.id));
                            }}
                            className="absolute right-4 top-4 text-muted hover:text-coral p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all hover:bg-coral/10 shrink-0"
                            title="Dismiss"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        {i < notifications.length - 1 && (
                          <div className="h-px w-full absolute bottom-0 left-0 bg-gradient-to-r from-transparent via-border-subtle to-transparent opacity-60 z-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch({ type: 'TOGGLE_DARK_MODE' })}
          className={`w-11 h-11 rounded-xl flex items-center justify-center text-muted transition-all duration-300 hover:scale-105 ${
            state.darkMode
              ? 'hover:text-amber hover:bg-section'
              : 'hover:text-ink hover:bg-ink-tint'
          }`}
        >
          {state.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block" style={{ flex: '0 0 100px' }}>
            <p className="text-sm font-bold text-display">{isAdmin ? 'Full Access' : 'Read Only'}</p>
            <p className="text-[11px] text-muted uppercase tracking-tight">Verified User</p>
          </div>
          <div className="w-10 h-10 rounded-full gradient-cta flex items-center justify-center text-white text-sm font-bold">
            AC
          </div>
        </div>
      </div>
    </header>
  );
}
