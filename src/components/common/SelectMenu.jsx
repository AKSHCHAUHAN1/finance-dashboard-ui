import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function SelectMenu({ value, onChange, options, placeholder = "Select...", className = "", up = false }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => (typeof o === 'string' ? o : o.value) === value);
  const displayLabel = selectedOption 
    ? (typeof selectedOption === 'string' ? selectedOption : selectedOption.label)
    : placeholder;

  return (
    <div className="relative inline-block text-left w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-between w-full text-left transition-all ${className}`}
      >
        <span className="block truncate">{displayLabel}</span>
        <ChevronDown size={16} className={`shrink-0 ml-2 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className={`absolute z-50 ${up ? 'bottom-full mb-2' : 'top-full mt-2'} w-full min-w-[140px] rounded-xl bg-card border border-ghost shadow-elevated py-1 animate-scale-in max-h-60 overflow-y-auto custom-scroll`}>
          {placeholder && (
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-section transition-colors ${
                !value ? 'font-bold text-display' : 'text-main'
              }`}
            >
              <span className="opacity-60 italic">{placeholder}</span>
              {!value && <Check size={14} className="text-emerald" />}
            </button>
          )}

          {options.map((opt) => {
            const isStr = typeof opt === 'string';
            const optVal = isStr ? opt : opt.value;
            const optLabel = isStr ? opt : opt.label;
            const isSelected = value === optVal;

            return (
              <button
                key={optVal}
                type="button"
                onClick={() => { onChange(optVal); setOpen(false); }}
                className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-section transition-colors ${
                  isSelected ? 'font-bold text-display' : 'text-main'
                }`}
              >
                <span className="truncate">{optLabel}</span>
                {isSelected && <Check size={14} className="text-emerald shrink-0 ml-2" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}