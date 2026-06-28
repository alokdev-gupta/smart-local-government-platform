import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { certificateAPI } from '../../services/api';

interface VerifyResult {
  certificateNumber: string;
  certificateType: string;
  issuedDate: string;
  expiryDate: string;
  isValid: boolean;
  holderName: string;
  issuedBy: string;
  message?: string;
  revokedReason?: string;
}

const VerifyCertificate: React.FC = () => {
  const { certNumber } = useParams<{ certNumber: string }>();
  const navigate = useNavigate();
  
  const [searchInput, setSearchInput] = useState(certNumber || '');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [isLoading, setIsLoading] = useState(!!certNumber);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const verify = async (numberToVerify: string) => {
    if (!numberToVerify.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setError('');
    setResult(null);
    
    try {
      const res = await certificateAPI.verify(numberToVerify);
      if (res.data.success && res.data.data) {
        setResult(res.data.data as VerifyResult);
      } else {
        setError(res.data.data?.message || 'Certificate not found.');
      }
    } catch (err) {
      setError('Certificate not found or invalid certificate number.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (certNumber) {
      verify(certNumber);
    }
  }, [certNumber]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/verify/${searchInput}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-16 px-4">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-2xl bg-gov-gradient flex items-center justify-center
                          text-5xl mx-auto mb-6 shadow-glow-blue animate-fade-in">
            🔍
          </div>
          <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Certificate Verification</h1>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            Official Government of Nepal portal to verify the authenticity of digital certificates.
          </p>
        </div>

        {/* Search Box */}
        <div className="glass-card-dark p-6 mb-8 border border-primary-500/20 shadow-lg">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">#</span>
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Certificate Number (e.g., CERT-BIRTH-2024-000001)"
                className="form-input pl-9 uppercase font-mono tracking-wider w-full text-sm md:text-base"
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary py-3 px-6 whitespace-nowrap"
              disabled={isLoading}
            >
              Verify
            </button>
          </form>
        </div>

        {/* Results Area */}
        {isLoading ? (
          <div className="glass-card-dark p-12 text-center animate-pulse">
            <div className="w-16 h-16 rounded-full border-4 border-primary-500/30 border-t-primary-500
                            animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Verifying authenticity with government registry...</p>
          </div>
        ) : hasSearched ? (
          <div className="animate-fade-in">
            {error ? (
              <div className="glass-card-dark p-10 text-center border border-red-500/40 bg-red-500/5 shadow-[0_0_30px_-5px_rgba(239,68,68,0.2)]">
                <div className="w-20 h-20 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center text-4xl mx-auto mb-4">
                  ❌
                </div>
                <h2 className="text-2xl font-bold text-red-400 mb-2">Verification Failed</h2>
                <p className="text-slate-300">{error}</p>
              </div>
            ) : result ? (
              <div className={`glass-card-dark p-8 border-2 shadow-2xl relative overflow-hidden ${
                result.isValid
                  ? 'border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_40px_-10px_rgba(16,185,129,0.3)]'
                  : 'border-red-500/50 bg-red-500/5 shadow-[0_0_40px_-10px_rgba(239,68,68,0.3)]'
              }`}>
                {/* Background watermark */}
                <div className="absolute -right-10 -bottom-10 opacity-[0.03] text-[200px] pointer-events-none">
                  🇳🇵
                </div>

                {/* Status Banner */}
                <div className="text-center mb-8">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 border-4 ${
                    result.isValid ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'
                  }`}>
                    {result.isValid ? '✅' : '❌'}
                  </div>
                  <h2 className={`text-3xl font-extrabold tracking-tight mb-2 ${result.isValid ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.isValid ? 'VALID CERTIFICATE' : 'INVALID CERTIFICATE'}
                  </h2>
                  <p className="text-slate-300">
                    {result.isValid 
                      ? 'This certificate is authentic and registered with the Local Government Office.'
                      : (result.message || 'This certificate has been revoked or expired.')}
                  </p>
                </div>

                {/* Certificate Details Grid */}
                <div className="bg-slate-900/60 rounded-2xl p-6 border border-slate-700/50 relative z-10">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pb-2 border-b border-slate-700/50">
                    Official Record Details
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Certificate Number</p>
                      <p className="font-mono text-primary-400 font-bold text-lg">{result.certificateNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Holder Name</p>
                      <p className="text-white font-semibold text-lg">{result.holderName}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Certificate Type</p>
                        <p className="text-slate-200 capitalize">{result.certificateType}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Issued By</p>
                        <p className="text-slate-200">{result.issuedBy}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Issued Date</p>
                        <p className="text-slate-200">{new Date(result.issuedDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs mb-1">Expiry Date</p>
                        <p className="text-slate-200">{new Date(result.expiryDate).toLocaleDateString('en-NP', { year: 'numeric', month: 'long', day: 'numeric'})}</p>
                      </div>
                    </div>

                    {!result.isValid && result.revokedReason && (
                      <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                        <p className="text-red-400 text-xs font-bold mb-1">Revocation Reason</p>
                        <p className="text-red-300 text-sm">{result.revokedReason}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 text-center text-slate-500 text-xs font-mono">
                  Verified at: {new Date().toLocaleString('en-NP')}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VerifyCertificate;
