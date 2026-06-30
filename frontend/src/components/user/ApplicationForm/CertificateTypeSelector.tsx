import React from 'react';
import type { CertificateType } from '../../../types';

interface CertInfo {
  id: CertificateType;
  icon: string;
  labelNepali: string;
  labelEnglish: string;
  days: number;
  docs: string[];
  color: string;
  border: string;
}

export const CERTIFICATE_TYPES: CertInfo[] = [
  {
    id: 'birth',
    icon: '👶',
    labelNepali: 'जन्म दर्ता',
    labelEnglish: 'Birth Certificate',
    days: 3,
    docs: ["Parent's Citizenship", 'Hospital Birth Record'],
    color: 'from-blue-500/20 to-blue-600/10',
    border: 'border-blue-500/30',
  },
  {
    id: 'citizenship',
    icon: '🪪',
    labelNepali: 'नागरिकता',
    labelEnglish: 'Citizenship Certificate',
    days: 7,
    docs: ['Birth Certificate', 'School Certificate', "Parent's Citizenship"],
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/30',
  },
  {
    id: 'residence',
    icon: '🏠',
    labelNepali: 'बसोबास प्रमाण',
    labelEnglish: 'Residence Certificate',
    days: 3,
    docs: ['Citizenship', 'Utility Bill or Ward Letter'],
    color: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/30',
  },
  {
    id: 'marriage',
    icon: '💒',
    labelNepali: 'विवाह दर्ता',
    labelEnglish: 'Marriage Certificate',
    days: 5,
    docs: ["Both parties' Citizenship", 'Witness Statements', 'Groom Photo', 'Bride Photo'],
    color: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/30',
  },
  {
    id: 'death',
    icon: '📋',
    labelNepali: 'मृत्यु दर्ता',
    labelEnglish: 'Death Certificate',
    days: 3,
    docs: ["Deceased's Citizenship", 'Hospital Death Record'],
    color: 'from-slate-500/20 to-slate-600/10',
    border: 'border-slate-500/30',
  },
  {
    id: 'income',
    icon: '💰',
    labelNepali: 'आय प्रमाण',
    labelEnglish: 'Income Certificate',
    days: 5,
    docs: ['Citizenship', 'Employment Letter or Tax Record'],
    color: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/30',
  },
  {
    id: 'character',
    icon: '📝',
    labelNepali: 'चरित्र प्रमाण',
    labelEnglish: 'Character Certificate',
    days: 3,
    docs: ['Citizenship', 'Application Letter'],
    color: 'from-teal-500/20 to-teal-600/10',
    border: 'border-teal-500/30',
  },
];

interface CertificateTypeSelectorProps {
  selected: CertificateType | '';
  onSelect: (type: CertificateType) => void;
}

const CertificateTypeSelector: React.FC<CertificateTypeSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-1">Select Certificate Type</h2>
      <p className="text-slate-400 text-sm mb-6">
        छाप्नु पर्ने प्रमाणपत्रको प्रकार छान्नुहोस्
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CERTIFICATE_TYPES.map((cert) => {
          const isSelected = selected === cert.id;
          return (
            <button
              key={cert.id}
              onClick={() => onSelect(cert.id)}
              className={`text-left p-5 rounded-2xl border-2 transition-all duration-200 hover:-translate-y-0.5
                          ${isSelected
                            ? 'border-primary-500 bg-primary-500/10 shadow-glow-blue'
                            : `border-slate-700/50 bg-gradient-to-br ${cert.color} hover:border-slate-500`
                          }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl border flex items-center justify-center
                               text-2xl flex-shrink-0 transition-transform
                               ${isSelected ? 'scale-110 border-primary-500/50' : cert.border}
                               bg-gradient-to-br ${cert.color}`}
                >
                  {cert.icon}
                </div>
                <div className="min-w-0">
                  <p className={`font-bold text-sm leading-tight ${isSelected ? 'text-primary-400' : 'text-white'}`}>
                    {cert.labelNepali}
                  </p>
                  <p className="text-slate-400 text-xs mt-0.5">{cert.labelEnglish}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="text-xs text-slate-500">⏱</span>
                    <span className="text-xs text-slate-400">{cert.days} business days</span>
                  </div>
                </div>
              </div>

              {/* Required docs */}
              <div className="mt-4 pt-3 border-t border-slate-700/40">
                <p className="text-slate-500 text-xs mb-1.5 font-medium uppercase tracking-wide">
                  Required Documents
                </p>
                <ul className="space-y-1">
                  {cert.docs.map((doc) => (
                    <li key={doc} className="flex items-center gap-1.5 text-xs text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-slate-500 flex-shrink-0" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {isSelected && (
                <div className="mt-3 flex items-center gap-2 text-primary-400 text-xs font-semibold">
                  <span className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center text-white text-xs">✓</span>
                  Selected
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CertificateTypeSelector;
