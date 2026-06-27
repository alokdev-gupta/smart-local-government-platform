import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import type { Application, DashboardStats } from '../../types';
import StatusBadge from '../../components/common/StatusBadge';
import Loader from '../../components/common/Loader';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats & { totalUsers?: number; totalCerts?: number }>({
    total: 0, pending: 0, under_review: 0, approved: 0, rejected: 0, thisMonth: 0,
  });
  const [recentApplications, setRecentApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [statsRes, appsRes] = await Promise.allSettled([
          adminAPI.getStats(),
          adminAPI.getAllApplications({ limit: 8 }),
        ]);

        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          const d = statsRes.value.data.data!;
          setStats({ ...d.stats, totalUsers: d.totalUsers, totalCerts: d.totalCerts });
        }
        if (appsRes.status === 'fulfilled' && appsRes.value.data.success) {
          setRecentApplications(appsRes.value.data.data?.applications || []);
        }
      } catch (err) {
        console.error('Admin dashboard error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader size="lg" text="Loading admin dashboard..." />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Applications', value: stats.total, icon: '📋', color: 'from-blue-500/20', border: 'border-blue-500/30', textColor: 'text-blue-400' },
    { label: 'Pending Review', value: stats.pending, icon: '⏳', color: 'from-amber-500/20', border: 'border-amber-500/30', textColor: 'text-amber-400' },
    { label: 'Under Review', value: stats.under_review, icon: '🔍', color: 'from-purple-500/20', border: 'border-purple-500/30', textColor: 'text-purple-400' },
    { label: 'Approved', value: stats.approved, icon: '✅', color: 'from-emerald-500/20', border: 'border-emerald-500/30', textColor: 'text-emerald-400' },
    { label: 'Rejected', value: stats.rejected, icon: '❌', color: 'from-red-500/20', border: 'border-red-500/30', textColor: 'text-red-400' },
    { label: 'This Month', value: stats.thisMonth, icon: '📅', color: 'from-teal-500/20', border: 'border-teal-500/30', textColor: 'text-teal-400' },
    { label: 'Total Users', value: stats.totalUsers || 0, icon: '👥', color: 'from-indigo-500/20', border: 'border-indigo-500/30', textColor: 'text-indigo-400' },
    { label: 'Active Certificates', value: stats.totalCerts || 0, icon: '🎖️', color: 'from-pink-500/20', border: 'border-pink-500/30', textColor: 'text-pink-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="bg-gov-gradient py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
              🛡️ Admin Dashboard
            </h1>
            <p className="text-blue-200 text-sm">Manage all government service applications</p>
          </div>
          <Link to="/admin/applications" className="btn-secondary">
            📋 All Applications
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div key={card.label}
              className={`glass-card-dark p-5 border ${card.border} bg-gradient-to-br ${card.color} to-transparent
                          hover:-translate-y-0.5 transition-all duration-200`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{card.icon}</span>
                <span className={`text-2xl font-bold ${card.textColor}`}>{card.value}</span>
              </div>
              <p className="text-slate-400 text-xs">{card.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Applications Table */}
          <div className="lg:col-span-2 glass-card-dark p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">🕐 Recent Applications</h2>
              <Link to="/admin/applications" className="text-primary-400 hover:text-primary-300 text-sm">
                View all →
              </Link>
            </div>

            {recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-slate-400">No applications yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="table-header text-left rounded-tl-lg">App Number</th>
                      <th className="table-header text-left">Type</th>
                      <th className="table-header text-left">Status</th>
                      <th className="table-header text-left rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app._id} className="hover:bg-white/5 transition-colors">
                        <td className="table-cell font-mono text-primary-400">{app.applicationNumber}</td>
                        <td className="table-cell capitalize">{app.certificateType}</td>
                        <td className="table-cell">
                          <StatusBadge status={app.status} size="sm" />
                        </td>
                        <td className="table-cell">
                          <Link
                            to={`/admin/applications/${app._id}`}
                            className="text-primary-400 hover:text-primary-300 text-xs font-medium"
                          >
                            Review →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Admin Quick Actions */}
          <div className="space-y-4">
            <div className="glass-card-dark p-5">
              <h2 className="text-base font-bold text-white mb-4">⚡ Admin Actions</h2>
              <div className="space-y-2">
                {[
                  { to: '/admin/applications?status=pending', icon: '⏳', label: `Pending (${stats.pending})`, color: 'text-amber-400' },
                  { to: '/admin/applications?status=under_review', icon: '🔍', label: `Under Review (${stats.under_review})`, color: 'text-purple-400' },
                  { to: '/admin/applications', icon: '📋', label: 'All Applications', color: 'text-blue-400' },
                  { to: '/admin/users', icon: '👥', label: 'Manage Users', color: 'text-emerald-400' },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform">{action.icon}</span>
                    <span className={`text-sm font-medium ${action.color}`}>{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Approval Rate */}
            <div className="glass-card-dark p-5">
              <h2 className="text-base font-bold text-white mb-4">📊 Approval Rate</h2>
              <div className="space-y-3">
                {[
                  { label: 'Approved', value: stats.approved, total: stats.total, color: 'bg-emerald-500' },
                  { label: 'Rejected', value: stats.rejected, total: stats.total, color: 'bg-red-500' },
                  { label: 'In Progress', value: stats.pending + stats.under_review, total: stats.total, color: 'bg-amber-500' },
                ].map((item) => {
                  const pct = stats.total ? Math.round((item.value / stats.total) * 100) : 0;
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-medium">{item.value} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
