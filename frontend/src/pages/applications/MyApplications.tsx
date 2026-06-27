import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { applicationAPI } from '../../services/api';
import type { Application, ApplicationStatus } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';

const STATUSES: (ApplicationStatus | 'all')[] = ['all', 'draft', 'pending', 'under_review', 'approved', 'rejected'];
const CERT_TYPES = ['all', 'birth', 'citizenship', 'residence', 'marriage', 'death', 'income', 'character'];

const MyApplications: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const statusFilter = (searchParams.get('status') || 'all') as ApplicationStatus | 'all';
  const typeFilter = searchParams.get('type') || 'all';

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      setError('');
      try {
        const params: Record<string, string> = { limit: '50' };
        if (statusFilter !== 'all') params.status = statusFilter;
        if (typeFilter !== 'all') params.certificateType = typeFilter;

        const res = await applicationAPI.getAll(params as any);
        if (res.data.success) {
          setApplications(res.data.data?.applications || []);
        }
      } catch {
        setError('Failed to load applications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, [statusFilter, typeFilter]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') params.delete(key);
    else params.set(key, value);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📋 My Applications</h1>
            <p className="text-slate-400 text-sm mt-1">Track all your certificate applications</p>
          </div>
          <Link to="/apply" className="btn-primary">➕ New Application</Link>
        </div>

        {/* Filters */}
        <div className="glass-card-dark p-4 mb-6 flex flex-wrap gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-slate-400 text-xs font-medium">Status:</span>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter('status', s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  statusFilter === s
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-slate-400 text-xs font-medium">Type:</span>
            {CERT_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setFilter('type', t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                  typeFilter === t
                    ? 'bg-secondary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader size="md" text="Loading applications..." /></div>
        ) : error ? (
          <div className="glass-card-dark p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="glass-card-dark p-16 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Applications Found</h3>
            <p className="text-slate-400 mb-6">
              {statusFilter !== 'all' || typeFilter !== 'all'
                ? 'No applications match your filters.'
                : 'You haven\'t applied for any certificates yet.'}
            </p>
            <Link to="/apply" className="btn-primary">Apply for Certificate</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link
                key={app._id}
                to={`/applications/${app._id}`}
                className="glass-card-dark p-5 flex flex-wrap items-center justify-between gap-4
                           hover:border-primary-600/40 border border-slate-700/30 transition-all
                           hover:bg-slate-800/60 group"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-gov-gradient flex items-center justify-center flex-shrink-0">
                    <span className="text-lg">📋</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold group-hover:text-primary-400 transition-colors">
                      {app.applicationNumber}
                    </p>
                    <p className="text-slate-400 text-xs capitalize mt-0.5">
                      {app.certificateType} Certificate
                      {app.priority === 'urgent' && (
                        <span className="ml-2 text-amber-400 font-medium">⚡ Urgent</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <StatusBadge status={app.status} />
                  <div className="text-right">
                    <p className="text-slate-400 text-xs">Applied</p>
                    <p className="text-white text-xs font-medium">
                      {new Date(app.createdAt).toLocaleDateString('en-NP')}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-slate-500 group-hover:text-primary-400 group-hover:translate-x-0.5 transition-all"
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
