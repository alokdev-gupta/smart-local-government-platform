import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  backLink?: string;
  actions?: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, backLink, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        {backLink && (
          <Link 
            to={backLink} 
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-primary-400 transition-colors mb-2"
          >
            ← Back
          </Link>
        )}
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-slate-400 mt-1.5 text-sm max-w-2xl">{subtitle}</p>}
      </div>
      
      {actions && (
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {actions}
        </div>
      )}
    </div>
  );
};
