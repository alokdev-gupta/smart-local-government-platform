import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminAPI, applicationAPI } from '../../services/api';
import type { Application } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';
import { AxiosError } from 'axios';

const AdminApplicationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [remarks, setRemarks] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetch = async () => {
      try {
        // Admin can use the regular endpoint since it's the same route with adminOnly
        const res = await applicationAPI.getById(id);
        if (res.data.success) setApplication(res.data.data?.application || null);
      } catch {
        setError('Failed to load application.');
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id]);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleApprove = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      const res = await adminAPI.approveApplication(id, { adminRemarks: remarks });
      if (res.data.success) {
        showMsg('success', 'Application approved and certificate issued!');
        setTimeout(() => navigate('/admin/applications'), 1500);
      }
    } catch (err) {
      const axErr = err as AxiosError<{ message: string }>;
      showMsg('error', axErr.response?.data?.message || 'Approval failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!id || !rejectionReason.trim()) {
      showMsg('error', 'Please provide a rejection reason.');
      return;
    }
    setActionLoading(true);
    try {
      await adminAPI.rejectApplication(id, { rejectionReason, adminRemarks: remarks });
      showMsg('success', 'Application rejected.');
      setTimeout(() => navigate('/admin/applications'), 1500);
    } catch (err) {
      const axErr = err as AxiosError<{ message: string }>;
      showMsg('error', axErr.response?.data?.message || 'Rejection failed.');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <Loader size="md" text="Loading..." />
    </div>;
  }

  if (error || !application) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="glass-card-dark p-8 text-center">
        <p className="text-red-400 mb-4">{error || 'Not found'}</p>
        <Link to="/admin/applications" className="btn-primary">Back</Link>
      </div>
    </div>;
  }

  const ad = application.applicantDetails;
  const canAct = ['pending', 'under_review'].includes(application.status);
  const userObj = typeof application.userId === 'object' ? application.userId : null;

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <div className="flex items-center gap-2 mb-6">
          <Link to="/admin/applications" className="text-slate-400 hover:text-white text-sm">
            ← All Applications
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 text-sm">{application.applicationNumber}</span>
        </div>

        {/* Status Message */}
        {message && (
          <div className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-6 animate-fade-in border ${
            message.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <span>{message.type === 'success' ? '✅' : '⚠️'}</span>
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        {/* Header Card */}
        <div className="glass-card-dark p-6 mb-5">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-bold text-white">{application.applicationNumber}</h1>
              <p className="text-slate-400 text-sm capitalize mt-1">
                {application.certificateType} Certificate ·{' '}
                {application.priority === 'urgent'
                  ? <span className="text-amber-400">⚡ Urgent</span>
                  : 'Normal Priority'
                }
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Applied', value: new Date(application.createdAt).toLocaleDateString('en-NP') },
              { label: 'Updated', value: new Date(application.updatedAt).toLocaleDateString('en-NP') },
              { label: 'Est. Completion', value: application.estimatedCompletionDate ? new Date(application.estimatedCompletionDate).toLocaleDateString('en-NP') : 'TBD' },
              { label: 'Documents', value: `${application.uploadedDocuments.length} file(s)` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                <p className="text-slate-500 text-xs mb-1">{label}</p>
                <p className="text-white text-sm font-medium">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Applicant Details */}
        <div className="glass-card-dark p-6 mb-5">
          <h2 className="text-lg font-bold text-white mb-4">👤 Applicant Details</h2>

          {/* Citizen Info */}
          {userObj && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gov-gradient flex items-center justify-center
                              font-bold text-white text-sm flex-shrink-0">
                {userObj.fullName?.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{userObj.fullName}</p>
                <p className="text-slate-400 text-xs">{userObj.email}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'Full Name', value: ad?.fullName },
              { label: 'DOB', value: ad?.dateOfBirth ? new Date(ad.dateOfBirth).toLocaleDateString() : '' },
              { label: 'Gender', value: ad?.gender },
              { label: 'Father\'s Name', value: ad?.fatherName },
              { label: 'Mother\'s Name', value: ad?.motherName },
              { label: 'Grandfather', value: ad?.grandfatherName },
              { label: 'Ward', value: ad?.wardNumber },
              { label: 'Municipality', value: ad?.municipalityName },
              { label: 'District', value: ad?.districtName },
              { label: 'Province', value: ad?.province },
            ].filter(i => i.value).map(({ label, value }) => (
              <div key={label} className="bg-slate-800/40 rounded-xl p-3">
                <p className="text-slate-500 text-xs mb-1">{label}</p>
                <p className="text-white text-sm capitalize">{value}</p>
              </div>
            ))}
            {ad?.permanentAddress && (
              <div className="sm:col-span-2 bg-slate-800/40 rounded-xl p-3">
                <p className="text-slate-500 text-xs mb-1">Permanent Address</p>
                <p className="text-white text-sm">{ad.permanentAddress}</p>
              </div>
            )}
          </div>
        </div>

        {/* Admin Action Panel */}
        {canAct && (
          <div className="glass-card-dark p-6 mb-5 border border-primary-800/40">
            <h2 className="text-lg font-bold text-white mb-4">⚖️ Admin Actions</h2>

            <div>
              <label className="form-label">Admin Remarks (optional)</label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                className="form-input resize-none mb-4"
                rows={3}
                placeholder="Add internal notes or remarks..."
                disabled={actionLoading}
              />
            </div>

            {showRejectForm && (
              <div className="mb-4">
                <label className="form-label">Rejection Reason *</label>
                <textarea
                  value={rejectionReason}
                  onChange={e => setRejectionReason(e.target.value)}
                  className="form-input resize-none border-red-500/50 focus:ring-red-500"
                  rows={3}
                  placeholder="Explain why the application is being rejected..."
                  disabled={actionLoading}
                />
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="btn-secondary flex items-center gap-2 py-2.5 px-6"
              >
                {actionLoading ? '...' : '✅ Approve & Issue Certificate'}
              </button>

              {!showRejectForm ? (
                <button
                  onClick={() => setShowRejectForm(true)}
                  className="btn-danger py-2.5 px-6"
                  disabled={actionLoading}
                >
                  ❌ Reject
                </button>
              ) : (
                <>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading || !rejectionReason.trim()}
                    className="btn-danger py-2.5 px-6 disabled:opacity-40"
                  >
                    {actionLoading ? '...' : '❌ Confirm Reject'}
                  </button>
                  <button
                    onClick={() => { setShowRejectForm(false); setRejectionReason(''); }}
                    className="btn-ghost py-2.5"
                    disabled={actionLoading}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Existing review info */}
        {(application.adminRemarks || application.rejectionReason) && (
          <div className={`p-5 rounded-2xl border mb-5 ${
            application.status === 'rejected'
              ? 'bg-red-500/10 border-red-500/30'
              : 'bg-emerald-500/10 border-emerald-500/30'
          }`}>
            <h3 className={`font-semibold mb-2 ${application.status === 'rejected' ? 'text-red-400' : 'text-emerald-400'}`}>
              {application.status === 'rejected' ? '❌ Rejection Reason' : '💬 Admin Remarks'}
            </h3>
            <p className="text-slate-300 text-sm">
              {application.rejectionReason || application.adminRemarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApplicationDetail;
