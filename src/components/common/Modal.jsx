import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function Modal({ children, onClose, title }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-overlay backdrop-blur-sm animate-fade" />
      <div
        className="relative bg-card rounded-2xl shadow-dramatic w-full max-w-lg max-h-[90vh] overflow-y-auto animate-scale-in scrollbar-thin"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-ghost">
          <h2 className="font-headline text-xl font-bold text-display tracking-tight">{title}</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-section flex items-center justify-center text-muted hover:text-display hover:bg-ink/10 hover:rotate-90 transition-all duration-300">
            <X size={16} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
}
