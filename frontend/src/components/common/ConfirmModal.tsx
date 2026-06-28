import React, { useEffect } from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  confirmVariant = 'primary',
  isLoading = false
}) => {
  
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, isLoading]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
        onClick={() => !isLoading && onClose()}
      />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl p-6 animate-fade-in overflow-hidden">
        
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">{message}</p>
        
        <div className="flex gap-3 justify-end">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          
          <button 
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2 rounded-xl text-sm font-medium flex items-center justify-center min-w-[100px] transition-all
              ${confirmVariant === 'danger' 
                ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                : 'bg-primary-600 text-white hover:bg-primary-500 shadow-lg shadow-primary-500/20'
              } disabled:opacity-50`}
          >
            {isLoading ? (
              <svg className="animate-spin w-4 h-4 text-current" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
