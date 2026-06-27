import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { certificateAPI } from '../../services/api';

interface VerifyResult {
  certificate: {
    certificateNumber: string;
    certificateType: string;
    issuedDate: string;
    expiryDate: string;
    isValid: boolean;
    downloadCount: number;
    userId?: { fullName: string; email: string };
    applicationId?: { certificateType: string; applicantDetails?: { fullName: string } };
  };
  isExpired: boolean;
  status: 'valid' | 'expired' | 'revoked';
}

const VerifyCertificate: React.FC = () => {
  const { certNumber } = useParams<{ certNumber: string }>();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!certNumber) return;
    const fetch = async () => {
      try {
        const res = await certificateAPI.verify(certNumber);
        if (res.data.success && res.data.data) {
          setResult(res.data.data as unknown as VerifyResult);
        } else {
          setError('Certificate not found.');
        }
      } catch {
        setError('Certificate not found or invalid certificate number.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [certNumber]);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gov-gradient flex items-center justify-center
                          text-4xl mx-auto mb-4 shadow-glow-blue">
            🔍
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Certificate Verification</h1>
          <p className="text-slate-400 text-sm">Government of Nepal — Official Certificate Validator</p>
        </div>

        {/* Certificate Number */}
        <div className="glass-card-dark p-4 mb-6 text-center">
          <p className="text-slate-400 text-xs mb-1">Verifying Certificate</p>
          <p className="text-primary-400 font-mono font-bold text-lg">{certNumber}</p>
        </div>

        {isLoading ? (
          <div className="glass-card-dark p-12 text-center">
            <div className="w-16 h-16 rounded-full border-4 border-primary-500/30 border-t-primary-500
                            animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Verifying certificate authenticity...</p>
          </div>
        ) : error ? (
          <div className="glass-card-dark p-10 text-center border border-red-500/30 bg-red-500/5">
            <div className="text-5xl mb-4">❌</div>
            <h2 className="text-xl font-bold text-red-400 mb-2">Not Found</h2>
            <p className="text-slate-400 text-sm">{error}</p>
          </div>
        ) : result ? (
          <div className={`glass-card-dark p-8 border-2 ${
            result.status === 'valid'
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-red-500/40 bg-red-500/5'
          }`}>
            {/* Status Banner */}
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 ${
              result.status === 'valid'
                ? 'bg-emerald-500/15 border border-emerald-500/30'
                : 'bg-red-500/15 border border-red-500/30'
            }`}>
              <span className="text-3xl">{result.status === 'valid' ? '✅' : '❌'}</span>
              <div>
                <p className={`font-bold text-lg ${result.status === 'valid' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {result.status === 'valid' ? 'CERTIFICATE VALID' : result.status === 'expired' ? 'CERTIFICATE EXPIRED' : 'CERTIFICATE REVOKED'}
                </p>
                <p className={`text-sm ${result.status === 'valid' ? 'text-emerald-300/70' : 'text-red-300/70'}`}>
                  {result.status === 'valid'
                    ? 'This is an authentic Government of Nepal certificate'
                    : 'This certificate is no longer valid'}
                </p>
              </div>
            </div>

            {/* Certificate Details */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">
                Certificate Details
              </h3>
              {[
                { label: 'Certificate Number', value: result.certificate.certificateNumber, mono: true },
                { label: 'Type', value: `${result.certificate.certificateType} Certificate`, capitalize: true },
                { label: 'Holder Name', value: result.certificate.applicationId?.applicantDetails?.fullName || result.certificate.userId?.fullName || 'N/A' },
                { label: 'Issued Date', value: new Date(result.certificate.issuedDate).toLocaleDateString('en-NP') },
                { label: 'Expiry Date', value: new Date(result.certificate.expiryDate).toLocaleDateString('en-NP') },
                { label: 'Status', value: result.status, capitalize: true },
              ].map(({ label, value, mono, capitalize }) => (
                <div key={label} className="flex justify-between items-center py-3 border-b border-slate-700/30">
                  <span className="text-slate-400 text-sm">{label}</span>
                  <span className={`text-sm font-medium ${mono ? 'font-mono text-primary-400' : 'text-white'} ${capitalize ? 'capitalize' : ''}`}>
                    {value}
                  </span>
                </div>
              ))}
            </div>

            {/* Seal */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-2 bg-slate-800/60 rounded-xl px-4 py-2">
                <span>🇳🇵</span>
                <span className="text-slate-400 text-xs">Government of Nepal — Digital Certificate Registry</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VerifyCertificate;
