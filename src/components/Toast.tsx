import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { CheckCircleIcon, AlertTriangleIcon, XIcon } from './Icons';

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  kind: ToastKind;
  title: string;
  body?: string;
}

interface ToastContextType {
  push: (toast: Omit<ToastItem, 'id'>) => void;
  success: (title: string, body?: string) => void;
  error: (title: string, body?: string) => void;
  info: (title: string, body?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setItems((prev) => [...prev.slice(-4), { ...toast, id }]);
    window.setTimeout(() => dismiss(id), 4200);
  }, [dismiss]);

  const value = useMemo<ToastContextType>(() => ({
    push,
    success: (title, body) => push({ kind: 'success', title, body }),
    error: (title, body) => push({ kind: 'error', title, body }),
    info: (title, body) => push({ kind: 'info', title, body }),
  }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[10000] flex w-[min(100%-2rem,22rem)] flex-col gap-2">
        {items.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-lift backdrop-blur ${
              toast.kind === 'success'
                ? 'border-brand-200 bg-white text-ink-900'
                : toast.kind === 'error'
                  ? 'border-coral-200 bg-white text-ink-900'
                  : 'border-ink-200 bg-white text-ink-900'
            }`}
            role="status"
          >
            {toast.kind === 'success' ? (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 text-brand-600" />
            ) : toast.kind === 'error' ? (
              <AlertTriangleIcon className="mt-0.5 h-5 w-5 text-coral-600" />
            ) : (
              <CheckCircleIcon className="mt-0.5 h-5 w-5 text-ink-500" />
            )}
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold">{toast.title}</div>
              {toast.body && <div className="mt-0.5 text-xs text-ink-500">{toast.body}</div>}
            </div>
            <button aria-label="Dismiss" onClick={() => dismiss(toast.id)} className="text-ink-400 hover:text-ink-700">
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
