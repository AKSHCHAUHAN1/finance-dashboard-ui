import { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, AlertTriangle, X } from 'lucide-react';

export default function Toast({ message, type }) {
  const { dispatch } = useApp();
  useEffect(() => {
    const t = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 3500);
    return () => clearTimeout(t);
  }, [dispatch]);

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-enter">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-elevated font-body text-sm font-medium
        ${type === 'success' ? 'bg-emerald text-white' : type === 'error' ? 'bg-coral text-white' : 'bg-card text-main border border-ghost'}`}>
        {type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
        <span>{message}</span>
        <button onClick={() => dispatch({ type: 'CLEAR_TOAST' })} className="ml-2 opacity-70 hover:opacity-100">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
