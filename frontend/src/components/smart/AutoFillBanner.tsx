import React, { useState } from 'react';

interface AutoFillBannerProps {
  previousData: any;
  onAutoFill: (data: any) => void;
}

export const AutoFillBanner: React.FC<AutoFillBannerProps> = ({ previousData, onAutoFill }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || !previousData) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border border-blue-500/30 rounded-xl p-4 mb-6 shadow-lg animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="text-2xl mt-0.5">⚡</div>
        <div>
          <h3 className="text-blue-400 font-bold text-sm">Save time with Auto-fill</h3>
          <p className="text-slate-300 text-xs mt-1 max-w-md">
            We found a previous application you submitted. Would you like to automatically fill your personal and address details using that data?
          </p>
        </div>
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <button 
          type="button"
          onClick={() => setIsVisible(false)}
          className="btn-ghost text-xs py-1.5 px-3 border border-slate-700 w-full sm:w-auto"
        >
          Dismiss
        </button>
        <button 
          type="button"
          onClick={() => {
            onAutoFill(previousData);
            setIsVisible(false);
          }}
          className="btn-primary bg-blue-600 hover:bg-blue-500 text-xs py-1.5 px-4 w-full sm:w-auto"
        >
          Auto-fill Details
        </button>
      </div>
    </div>
  );
};
