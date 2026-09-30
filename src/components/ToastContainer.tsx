import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-3 duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-800 text-emerald-200 shadow-emerald-950/40'
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-800 text-rose-200 shadow-rose-950/40'
              : 'bg-stone-800/95 border-stone-700 text-stone-200 shadow-stone-950/40'
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="flex-1 text-xs font-medium leading-relaxed">{toast.message}</div>
          <button
            onClick={() => removeToast(toast.id)}
            className="shrink-0 text-stone-400 hover:text-stone-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
