import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import type { Application } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';

const ApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const justCreated = location.state?.justCreated;

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        const res = await applicationAPI.getById(id);
        if (res.data.success) setApplication(res.data.data?.application || null);
      } catch {
        setError('Failed to load application details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader size="md" text="Loading application..." />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="glass-card-dark p-8 text-center max-w-md">
          <p className="text-5xl mb-4">❌</p>
          <p className="text-red-400 mb-4">{error || 'Application not found'}</p>
          <Link to="/applications" className="btn-primary">Back to Applications</Link>
        </div>
      </div>
    );
  }

  const ad = application.applicantDetails;

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Just created banner */}
        {justCreated && (
          <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl px-5 py-4 mb-6
                          flex items-center gap-3 animate-fade-in">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-emerald-400 font-semibold">Application Submitted Successfully!</p>
              <p className="text-emerald-300/70 text-sm">
                Your application is now under review. You'll be notified of any updates.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/applications" className="text-slate-400 hover:text-white transition-colors">
            ← Back
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300">{application.applicationNumber}</span>
        </div>

        {/* Main Info Card */}
        <div className="glass-card-dark p-6 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{application.applicationNumber}</h1>
              <p className="text-slate-400 text-sm capitalize">
                {application.certificateType} Certificate
                {application.priority === 'urgent' && (
                  <span className="ml-2 text-amber-400 font-medium">⚡ Urgent</span>
                )}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          {/* Status Timeline */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-300 mb-4">Application Progress</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-700" />
              {[
                { status: 'draft', icon: '📝', label: 'Draft Created', active: true },
                { status: 'pending', icon: '📤', label: 'Submitted for Review', active: ['pending','under_review','approved','rejected'].includes(application.status) },
                { status: 'under_review', icon: '🔍', label: 'Under Review', active: ['under_review','approved','rejected'].includes(application.status) },
                { status: 'approved', icon: '✅', label: 'Approved / Rejected', active: ['approved','rejected'].includes(application.status) },
              ].map((step) => (
                <div key={step.status} className="flex items-center gap-4 mb-4 relative pl-2">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs
                    z-10 relative flex-shrink-0 ${step.active
                      ? 'border-primary-500 bg-primary-500/20'
                      : 'border-slate-600 bg-slate-800'
                    }`}>
                    <span>{step.active ? step.icon : '○'}</span>
                  </div>
                  <span className={`text-sm ${step.active ? 'text-white font-medium' : 'text-slate-500'}`}>
                    {step.label}
                    {step.status === 'approved' && application.status === 'rejected' && (
                      <span className="text-red-400 ml-2">— Rejected</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-800/40 rounded-xl">
            <div>
              <p className="text-slate-500 text-xs mb-1">Applied Date</p>
              <p className="text-white text-sm font-medium">
                {new Date(application.createdAt).toLocaleDateString('en-NP')}
              </p>
            </div>
            <div>
              <p className="text-slate-500 text-xs mb-1">Est. Completion</p>
              <p className="text-white text-sm font-medium">
                {application.estimatedCompletionDate
                  ? new Date(application.estimatedCompletionDate).toLocaleDateString('en-NP')
                  : 'TBD'}
              </p>
            </div>
            {application.reviewedAt && (
              <div>
                <p className="text-slate-500 text-xs mb-1">Reviewed Date</p>
                <p className="text-white text-sm font-medium">
                  {new Date(application.reviewedAt).toLocaleDateString('en-NP')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Applicant Details */}
        <div className="glass-card-dark p-6 mb-5">
          <h2 className="text-lg font-bold text-white mb-5">👤 Applicant Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name', value: ad?.fullName },
              { label: 'Date of Birth', value: ad?.dateOfBirth ? new Date(ad.dateOfBirth).toLocaleDateString() : '' },
              { label: 'Gender', value: ad?.gender },
              { label: 'Father\'s Name', value: ad?.fatherName },
              { label: 'Mother\'s Name', value: ad?.motherName },
              { label: 'Grandfather\'s Name', value: ad?.grandfatherName },
              { label: 'Ward Number', value: ad?.wardNumber },
              { label: 'Municipality', value: ad?.municipalityName },
              { label: 'District', value: ad?.districtName },
              { label: 'Province', value: ad?.province },
            ].filter(item => item.value).map(({ label, value }) => (
              <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">{label}</p>
                <p className="text-white text-sm capitalize">{value}</p>
              </div>
            ))}

            {ad?.permanentAddress && (
              <div className="sm:col-span-2 bg-slate-800/40 rounded-xl p-3">
                <p className="text-slate-400 text-xs mb-1">Permanent Address</p>
                <p className="text-white text-sm">{ad.permanentAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Remarks / Rejection */}
        {(application.adminRemarks || application.rejectionReason) && (
          <div className={`p-5 rounded-2xl border mb-5 ${
            application.status === 'rejected'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-blue-500/10 border-blue-500/30'
          }`}>
            <h3 className={`font-semibold mb-2 ${
              application.status === 'rejected' ? 'text-red-400' : 'text-blue-400'
            }`}>
              {application.status === 'rejected' ? '❌ Rejection Reason' : '💬 Admin Remarks'}
            </h3>
            <p className="text-slate-300 text-sm">
              {application.rejectionReason || application.adminRemarks}
            </p>
          </div>
        )}

        {/* Back */}
        <Link to="/applications" className="btn-outline w-full text-center block py-3">
          ← Back to My Applications
        </Link>
      </div>
    </div>
  );
};

export default ApplicationDetail;
