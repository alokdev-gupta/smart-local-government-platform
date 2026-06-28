import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Toast as ToastType, ToastType as ToastVariant } from '../../types';

interface ToastContextType {
  showToast: (message: string, type?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const showToast = useCallback((message: string, type: ToastVariant = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }].slice(-3)); // Keep max 3 toasts

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => {
          let bgClass = 'bg-blue-500/10 border-blue-500/30 text-blue-400';
          let icon = 'ℹ️';
          
          if (toast.type === 'success') {
            bgClass = 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
            icon = '✅';
          } else if (toast.type === 'error') {
            bgClass = 'bg-red-500/10 border-red-500/30 text-red-400';
            icon = '❌';
          } else if (toast.type === 'warning') {
            bgClass = 'bg-amber-500/10 border-amber-500/30 text-amber-400';
            icon = '⚠️';
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl pointer-events-auto transition-all animate-fade-in ${bgClass} max-w-sm`}
            >
              <div className="shrink-0 mt-0.5">{icon}</div>
              <p className="text-sm font-medium pr-6">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="absolute right-3 top-3 opacity-50 hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
