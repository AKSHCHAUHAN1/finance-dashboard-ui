/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { MOCK_TRANSACTIONS } from '../data/mockData';

const AppContext = createContext();

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}

const initialFilters = {
  search: '',
  category: '',
  type: '',
  startDate: '',
  endDate: '',
  sortBy: 'date-desc',
};

function loadState() {
  try {
    const s = localStorage.getItem('ledger-state');
    return s ? JSON.parse(s) : null;
  } catch { return null; }
}

function saveState(state) {
  try {
    localStorage.setItem('ledger-state', JSON.stringify({
      transactions: state.transactions,
      role: state.role,
      darkMode: state.darkMode,
      email: state.email,
    }));
  } catch {
    return;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, role: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions], toast: { message: 'Transaction added!', type: 'success' } };
    case 'UPDATE_TRANSACTION':
      return { ...state, transactions: state.transactions.map(t => t.id === action.payload.id ? action.payload : t), toast: { message: 'Transaction updated!', type: 'success' } };
    case 'DELETE_TRANSACTION':
      return { ...state, transactions: state.transactions.filter(t => t.id !== action.payload), toast: { message: 'Transaction deleted.', type: 'success' } };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_TOAST':
      return { ...state, toast: action.payload };
    case 'CLEAR_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const saved = loadState();
  const hasMounted = useRef(false);

  const initialState = {
    transactions: saved?.transactions || MOCK_TRANSACTIONS,
    role: saved?.role || 'admin',
    darkMode: saved?.darkMode || false,
    email: saved?.email || 'aksh.chauhan@ledger.com',
    filters: { ...initialFilters },
    toast: null,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveState({
      transactions: state.transactions,
      role: state.role,
      darkMode: state.darkMode,
      email: state.email,
    });
  }, [state.transactions, state.role, state.darkMode, state.email]);

  useEffect(() => {
    const root = document.documentElement;

    if (!hasMounted.current) {
      hasMounted.current = true;
      if (state.darkMode) root.classList.add('dark');
      else root.classList.remove('dark');
      return;
    }

    root.classList.add('theme-transitioning');
    if (state.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');

    const timeoutId = window.setTimeout(() => {
      root.classList.remove('theme-transitioning');
    }, 480);

    return () => {
      window.clearTimeout(timeoutId);
      root.classList.remove('theme-transitioning');
    };
  }, [state.darkMode]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}
