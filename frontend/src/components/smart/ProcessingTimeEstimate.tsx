import React from 'react';

interface ProcessingTimeEstimateProps {
  certificateType: string;
  priority: 'normal' | 'urgent';
  onUpgradeToUrgent?: () => void;
}

export const ProcessingTimeEstimate: React.FC<ProcessingTimeEstimateProps> = ({ 
  certificateType, 
  priority,
  onUpgradeToUrgent
}) => {
  if (!certificateType) return null;

  let normalDays = '3-5';
  let urgentDays = '1-2';

  if (certificateType === 'citizenship') {
    normalDays = '7-10';
    urgentDays = '2-3';
  } else if (certificateType === 'marriage' || certificateType === 'death') {
    normalDays = '5-7';
    urgentDays = '1-2';
  }

  const isUrgent = priority === 'urgent';
  const estimatedText = isUrgent ? `${urgentDays} working days` : `${normalDays} working days`;

  return (
    <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 animate-fade-in ${
      isUrgent 
        ? 'bg-amber-500/10 border-amber-500/30' 
        : 'bg-slate-800/50 border-slate-700'
    }`}>
      <div className="flex items-center gap-3">
        <div className="text-2xl">{isUrgent ? '⚡' : '⏱️'}</div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider font-bold mb-0.5">Estimated Processing Time</p>
          <p className={`text-sm font-medium ${isUrgent ? 'text-amber-400' : 'text-white'}`}>
            {estimatedText} <span className="text-slate-500 text-xs font-normal">({priority} priority)</span>
          </p>
        </div>
      </div>
      
      {!isUrgent && onUpgradeToUrgent && (
        <button
          type="button"
          onClick={onUpgradeToUrgent}
          className="text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/20 transition-colors whitespace-nowrap"
        >
          Upgrade to Urgent ({urgentDays} days)
        </button>
      )}
    </div>
  );
};
