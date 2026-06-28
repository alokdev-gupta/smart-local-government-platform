import React, { useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-fade-in transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Dialog */}
      <div 
        className={`relative w-full ${sizeClasses[size]} bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden animate-fade-in`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
            <h3 className="text-lg font-bold text-white">{title}</h3>
            <button 
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors bg-slate-800 hover:bg-slate-700 w-8 h-8 rounded-full flex items-center justify-center"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        )}
        
        {/* Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};
