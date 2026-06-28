import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  icon, 
  title, 
  description, 
  actionLabel, 
  onAction 
}) => {
  return (
    <div className="glass-card-dark flex flex-col items-center justify-center p-12 text-center animate-fade-in border-dashed border-2 border-slate-700/50 hover:border-slate-600 transition-colors">
      <div className="w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center text-4xl mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="btn-primary py-2.5 px-6 shadow-lg shadow-primary-500/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
