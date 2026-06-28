import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import type { CertificateType } from '../../types';
import { AxiosError } from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { SmartFormHelper } from '../../components/smart/SmartFormHelper';
import { AutoFillBanner } from '../../components/smart/AutoFillBanner';
import { ProcessingTimeEstimate } from '../../components/smart/ProcessingTimeEstimate';

const CERT_TYPES: { id: CertificateType; icon: string; label: string; desc: string }[] = [
  { id: 'birth', icon: '👶', label: 'Birth Certificate', desc: 'For newborn registration' },
  { id: 'citizenship', icon: '🪪', label: 'Citizenship Certificate', desc: 'Nepali citizenship' },
  { id: 'residence', icon: '🏠', label: 'Residence Certificate', desc: 'Proof of residence' },
  { id: 'marriage', icon: '💍', label: 'Marriage Certificate', desc: 'Marriage registration' },
  { id: 'death', icon: '📋', label: 'Death Certificate', desc: 'Death registration' },
  { id: 'income', icon: '💰', label: 'Income Certificate', desc: 'Proof of income' },
  { id: 'character', icon: '⭐', label: 'Character Certificate', desc: 'Good conduct certificate' },
];

const PROVINCES = ['Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'];

const ApplyCertificate: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const defaultType = (searchParams.get('type') || '') as CertificateType | '';

  const [step, setStep] = useState(defaultType ? 2 : 1);
  const [selectedType, setSelectedType] = useState<CertificateType | ''>(defaultType);
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previousAppDetails, setPreviousAppDetails] = useState<any>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: '',
    fatherName: '',
    motherName: '',
    grandfatherName: '',
    permanentAddress: '',
    temporaryAddress: '',
    wardNumber: '',
    municipalityName: '',
    districtName: '',
    province: '',
  });

  useEffect(() => {
    const fetchPrevious = async () => {
      try {
        const res = await applicationAPI.getAll();
        if (res.data.success && res.data.data?.applications && res.data.data.applications.length > 0) {
          setPreviousAppDetails(res.data.data.applications[0].applicantDetails);
        }
      } catch (err) {}
    };
    fetchPrevious();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    if (!formData.fullName.trim()) {
      setError('Full name is required.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await applicationAPI.create({
        certificateType: selectedType,
        priority,
        applicantDetails: {
          ...formData,
          dateOfBirth: formData.dateOfBirth || undefined,
        } as any,
        status: 'pending',
      });

      if (res.data.success && res.data.data?.application) {
        navigate(`/applications/${res.data.data.application._id}`, {
          state: { justCreated: true },
        });
      }
    } catch (err) {
      const axErr = err as AxiosError<{ message: string }>;
      setError(axErr.response?.data?.message || 'Failed to submit application.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">📝 Apply for Certificate</h1>
          <p className="text-slate-400 text-sm mt-1">Complete the form to submit your application</p>
        </div>

        <div className="flex items-center gap-3 mb-8">
          {[
            { n: 1, label: 'Select Type' },
            { n: 2, label: 'Fill Details' },
            { n: 3, label: 'Submitted' },
          ].map(({ n, label }, i, arr) => (
            <React.Fragment key={n}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                  ${step >= n ? 'bg-primary-600 text-white' : 'bg-slate-700 text-slate-400'}`}>
                  {n}
                </div>
                <span className={`text-sm font-medium hidden sm:block ${step >= n ? 'text-white' : 'text-slate-500'}`}>
                  {label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div className={`flex-1 h-0.5 transition-all ${step > n ? 'bg-primary-600' : 'bg-slate-700'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="glass-card-dark p-6 mb-4">
              <h2 className="text-lg font-bold text-white mb-1">Select Certificate Type</h2>
              <p className="text-slate-400 text-sm mb-5">Choose the type of certificate you need</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CERT_TYPES.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => setSelectedType(cert.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all
                      ${selectedType === cert.id
                        ? 'border-primary-500 bg-primary-500/10'
                        : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                      }`}
                  >
                    <span className="text-3xl">{cert.icon}</span>
                    <div>
                      <p className={`font-medium text-sm ${selectedType === cert.id ? 'text-primary-400' : 'text-white'}`}>
                        {cert.label}
                      </p>
                      <p className="text-slate-400 text-xs">{cert.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card-dark p-5 mb-5">
              <h3 className="text-sm font-semibold text-white mb-3">Processing Priority</h3>
              <div className="flex gap-3">
                {(['normal', 'urgent'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium border capitalize transition-all
                      ${priority === p
                        ? p === 'urgent' ? 'border-amber-500 bg-amber-500/15 text-amber-400'
                          : 'border-primary-500 bg-primary-500/10 text-primary-400'
                        : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                  >
                    {p === 'urgent' ? '⚡ Urgent' : '📋 Normal'}
                  </button>
                ))}
              </div>
              <ProcessingTimeEstimate 
                  certificateType={selectedType || 'birth'} 
                  priority={priority}
                  onUpgradeToUrgent={() => setPriority('urgent')}
              />
            </div>

            <button
              disabled={!selectedType}
              onClick={() => setStep(2)}
              className="btn-primary w-full py-3 disabled:opacity-40"
            >
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <div className="glass-card-dark p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-lg font-bold text-white">Applicant Details</h2>
                  <p className="text-slate-400 text-xs mt-0.5 capitalize">
                    {selectedType} Certificate · {priority} Priority
                  </p>
                </div>
                <button onClick={() => setStep(1)} className="text-slate-400 hover:text-white text-sm">
                  ← Back
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-5">
                  <span className="text-red-400">⚠️</span>
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              <AutoFillBanner 
                previousData={previousAppDetails} 
                onAutoFill={(data) => {
                  setFormData(prev => ({ ...prev, ...data }));
                }} 
              />

              <form id="apply-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input name="fullName" value={formData.fullName} onChange={handleChange}
                      className="form-input" placeholder="Ram Bahadur Thapa" required disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">Date of Birth</label>
                    <input name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange}
                      className="form-input" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange}
                      className="form-input" disabled={isLoading}>
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Ward Number</label>
                    <input name="wardNumber" value={formData.wardNumber} onChange={handleChange}
                      className="form-input" placeholder="Ward No." disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">Father's Name</label>
                    <input name="fatherName" value={formData.fatherName} onChange={handleChange}
                      className="form-input" placeholder="Father's full name" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">Mother's Name</label>
                    <input name="motherName" value={formData.motherName} onChange={handleChange}
                      className="form-input" placeholder="Mother's full name" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">Grandfather's Name</label>
                    <input name="grandfatherName" value={formData.grandfatherName} onChange={handleChange}
                      className="form-input" placeholder="Grandfather's full name" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">Municipality</label>
                    <input name="municipalityName" value={formData.municipalityName} onChange={handleChange}
                      className="form-input" placeholder="Municipality name" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">District</label>
                    <input name="districtName" value={formData.districtName} onChange={handleChange}
                      className="form-input" placeholder="District name" disabled={isLoading} />
                  </div>
                  <div>
                    <label className="form-label">Province</label>
                    <select name="province" value={formData.province} onChange={handleChange}
                      className="form-input" disabled={isLoading}>
                      <option value="">Select province</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Permanent Address</label>
                  <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange}
                    className="form-input resize-none" rows={2} placeholder="Ward No., VDC/Municipality, District"
                    disabled={isLoading} />
                </div>
                <div>
                  <label className="form-label">Temporary Address</label>
                  <textarea name="temporaryAddress" value={formData.temporaryAddress} onChange={handleChange}
                    className="form-input resize-none" rows={2} placeholder="Current residence address"
                    disabled={isLoading} />
                </div>

                <SmartFormHelper 
                  certificateType={selectedType || ''}
                  applicantDetails={formData}
                  uploadedDocuments={[]}
                />

                <button
                  id="apply-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Submitting...
                    </>
                  ) : '🚀 Submit Application'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyCertificate;
