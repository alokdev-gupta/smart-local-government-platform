import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import type { Application, ApplicationStatus } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';

const STATUSES: (ApplicationStatus | 'all')[] = ['all', 'pending', 'under_review', 'approved', 'rejected', 'draft'];

const AllApplications: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const statusFilter = (searchParams.get('status') || 'all') as ApplicationStatus | 'all';
  const page = parseInt(searchParams.get('page') || '1');

  const fetchApps = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { limit: 20, page };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await adminAPI.getAllApplications(params as any);
      if (res.data.success) {
        setApplications(res.data.data?.applications || []);
        setTotal((res.data.data?.pagination as any)?.total || 0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchApps(); }, [statusFilter, page]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') params.delete(key);
    else params.set(key, value);
    params.delete('page');
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📋 All Applications</h1>
            <p className="text-slate-400 text-sm mt-1">
              {total} total application{total !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/admin" className="btn-ghost">← Admin Dashboard</Link>
        </div>

        {/* Status Filters */}
        <div className="glass-card-dark p-4 mb-6 flex flex-wrap gap-2">
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

        {/* Table */}
        <div className="glass-card-dark overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader size="md" text="Loading..." /></div>
          ) : applications.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">📭</p>
              <p className="text-slate-400">No applications match the current filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="table-header text-left">App Number</th>
                    <th className="table-header text-left">Applicant</th>
                    <th className="table-header text-left">Type</th>
                    <th className="table-header text-left">Priority</th>
                    <th className="table-header text-left">Status</th>
                    <th className="table-header text-left">Date</th>
                    <th className="table-header text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => {
                    const userObj = typeof app.userId === 'object' ? app.userId : null;
                    return (
                      <tr key={app._id} className="hover:bg-white/5 transition-colors">
                        <td className="table-cell font-mono text-primary-400 font-medium">
                          {app.applicationNumber}
                        </td>
                        <td className="table-cell">
                          <div>
                            <p className="text-white font-medium">{userObj?.fullName || '—'}</p>
                            <p className="text-slate-500 text-xs">{userObj?.email || ''}</p>
                          </div>
                        </td>
                        <td className="table-cell capitalize">{app.certificateType}</td>
                        <td className="table-cell">
                          {app.priority === 'urgent' ? (
                            <span className="text-amber-400 text-xs font-semibold">⚡ Urgent</span>
                          ) : (
                            <span className="text-slate-500 text-xs">Normal</span>
                          )}
                        </td>
                        <td className="table-cell">
                          <StatusBadge status={app.status} size="sm" />
                        </td>
                        <td className="table-cell text-slate-400">
                          {new Date(app.createdAt).toLocaleDateString('en-NP')}
                        </td>
                        <td className="table-cell">
                          <Link
                            to={`/admin/applications/${app._id}`}
                            className="text-primary-400 hover:text-primary-300 text-xs font-medium whitespace-nowrap"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllApplications;
