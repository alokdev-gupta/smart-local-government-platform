import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
};

const textSizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const Loader: React.FC<LoaderProps> = ({ size = 'md', text, className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Spinning rings */}
      <div className={`relative ${sizeMap[size]}`}>
        <div
          className={`absolute inset-0 rounded-full border-2 border-primary-500/20`}
        />
        <div
          className={`absolute inset-0 rounded-full border-2 border-transparent border-t-primary-500 animate-spin`}
        />
        <div
          className={`absolute inset-1 rounded-full border-2 border-transparent border-t-secondary-500 animate-spin`}
          style={{ animationDirection: 'reverse', animationDuration: '0.7s' }}
        />
        {size === 'lg' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">🇳🇵</span>
          </div>
        )}
      </div>

      {text && (
        <p className={`text-slate-400 font-medium animate-pulse ${textSizeMap[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
