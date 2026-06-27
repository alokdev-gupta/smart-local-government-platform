import React from 'react';

interface Step {
  number: number;
  label: string;
  icon: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, steps }) => {
  return (
    <div className="relative mb-10">
      {/* Connector line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-700 hidden sm:block" />
      <div
        className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-500
                   hidden sm:block transition-all duration-700 ease-in-out"
        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
      />

      <div className="relative flex justify-between">
        {steps.map((step) => {
          const isDone = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="flex flex-col items-center gap-2">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 relative
                             text-sm font-bold border-2 transition-all duration-300
                             ${isDone
                               ? 'bg-emerald-500 border-emerald-500 text-white shadow-glow-green'
                               : isActive
                               ? 'bg-primary-600 border-primary-500 text-white shadow-glow-blue scale-110'
                               : 'bg-slate-800 border-slate-600 text-slate-500'
                             }`}
              >
                {isDone ? '✓' : step.icon}
              </div>
              {/* Label */}
              <span
                className={`text-xs font-medium hidden sm:block text-center max-w-[80px] leading-tight
                             ${isActive ? 'text-primary-400' : isDone ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
