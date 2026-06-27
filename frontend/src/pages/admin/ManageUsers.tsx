import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/api';
import type { User } from '../../types';
import Loader from '../../components/common/Loader';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminAPI.getAllUsers({ limit: 50 });
        if (res.data.success) {
          setUsers(res.data.data?.users || []);
          setTotal((res.data.data?.pagination as any)?.total || 0);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">👥 Manage Users</h1>
          <p className="text-slate-400 text-sm mt-1">{total} registered citizen{total !== 1 ? 's' : ''}</p>
        </div>

        <div className="glass-card-dark overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-20"><Loader size="md" text="Loading users..." /></div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">👥</p>
              <p className="text-slate-400">No users found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="table-header text-left">User</th>
                    <th className="table-header text-left">Phone</th>
                    <th className="table-header text-left">Role</th>
                    <th className="table-header text-left">Status</th>
                    <th className="table-header text-left">Joined</th>
                    <th className="table-header text-left">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-white/5 transition-colors">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gov-gradient flex items-center justify-center
                                          text-sm font-bold text-white flex-shrink-0">
                            {u.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">{u.fullName}</p>
                            <p className="text-slate-500 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell text-slate-300">{u.phone || '—'}</td>
                      <td className="table-cell">
                        <span className={`badge capitalize ${
                          u.role === 'admin'
                            ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                            : 'bg-slate-700/50 text-slate-300 border border-slate-600/40'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="table-cell">
                        <span className={`badge ${
                          u.isActive
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-red-500/15 text-red-400 border border-red-500/30'
                        }`}>
                          {u.isActive ? '● Active' : '● Inactive'}
                        </span>
                      </td>
                      <td className="table-cell text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString('en-NP')}
                      </td>
                      <td className="table-cell text-slate-400">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-NP') : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
