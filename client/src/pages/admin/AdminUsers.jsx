import React, { useEffect, useState } from 'react';
import adminService from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';

export default function AdminUsers() {
  const { user: currentUser } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  // Custom confirmation modal states replacing default window.confirm
  const [pendingAction, setPendingAction] = useState(null); // { type: 'role' | 'delete', targetUser: object }
  const [actionLoading, setActionLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAdminUsers({
        page,
        limit: 10,
        search,
        role,
      });
      setUsers(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, role]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleRoleToggle = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'user' : 'admin';
    try {
      setActionLoading(true);
      await adminService.updateUserRole(targetUser._id, newRole);
      setPendingAction(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update role');
      setPendingAction(null);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (targetUser) => {
    try {
      setActionLoading(true);
      await adminService.deleteUser(targetUser._id);
      setPendingAction(null);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
      setPendingAction(null);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="border-b border-cyan-500/20 pb-4">
        <h1 className="text-xl font-mono font-black uppercase tracking-wider bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-white bg-clip-text text-transparent">
          User Management
        </h1>
        <p className="text-slate-400 font-mono text-xs mt-1">
          &gt; Manage platform accounts and administrative permissions
        </p>
      </div>

      {/* Styled Confirmation Popup */}
      {pendingAction && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-4">
          <div className="relative bg-[#080813] border-2 border-fuchsia-500/80 rounded-xl p-5 shadow-[0_0_30px_rgba(217,70,239,0.35)] space-y-4">
            <div className="flex items-center space-x-2 text-fuchsia-400 font-mono text-xs uppercase tracking-wider font-bold">
              <span className="h-2 w-2 rounded-full bg-fuchsia-500 animate-ping" />
              <span>
                [SYSTEM WARNING]: Confirm {pendingAction.type === 'role' ? 'Role Change' : 'User Deletion'}
              </span>
            </div>

            <p className="text-xs font-mono text-slate-300 leading-relaxed">
              {pendingAction.type === 'role' ? (
                <>
                  Change role of <span className="text-cyan-300 font-bold">{pendingAction.targetUser.name}</span> to{' '}
                  <span className="text-fuchsia-400 font-bold">
                    "{pendingAction.targetUser.role === 'admin' ? 'user' : 'admin'}"
                  </span>?
                </>
              ) : (
                <>
                  Permanently delete user <span className="text-rose-400 font-bold">{pendingAction.targetUser.name}</span>? This action cannot be undone.
                </>
              )}
            </p>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setPendingAction(null)}
                disabled={actionLoading}
                className="px-3 py-1.5 bg-[#030308] border border-slate-800 text-slate-400 hover:text-white rounded-lg text-xs font-mono font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (pendingAction.type === 'role') handleRoleToggle(pendingAction.targetUser);
                  if (pendingAction.type === 'delete') handleDeleteUser(pendingAction.targetUser);
                }}
                disabled={actionLoading}
                className={`px-3 py-1.5 text-white rounded-lg text-xs font-mono font-bold transition-all disabled:opacity-50 ${
                  pendingAction.type === 'delete'
                    ? 'bg-rose-600 hover:bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                    : 'bg-fuchsia-600 hover:bg-fuchsia-500 shadow-[0_0_12px_rgba(217,70,239,0.4)]'
                }`}
              >
                {actionLoading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-[#080813] border border-cyan-500/20 p-4 rounded-xl flex flex-col md:flex-row gap-4 shadow-[0_0_15px_rgba(34,211,238,0.05)]">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            placeholder="Search user by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#030308] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 rounded-lg text-xs font-mono font-bold transition-all"
          >
            Search
          </button>
        </form>

        <select
          value={role}
          onChange={(e) => { setRole(e.target.value); setPage(1); }}
          className="bg-[#030308] border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
        >
          <option value="" className="bg-[#030308] text-slate-500">All Roles</option>
          <option value="user" className="bg-[#030308] text-slate-200">User</option>
          <option value="admin" className="bg-[#030308] text-slate-200">Admin</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="p-8 text-center text-slate-400 font-mono text-xs">Loading users...</div>
      ) : error ? (
        <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-lg text-rose-300 font-mono text-xs flex items-center space-x-2">
          <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
          <span>[ERROR]: {error}</span>
        </div>
      ) : users.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-[#080813] border border-cyan-500/20 rounded-xl font-mono text-xs">
          No users found.
        </div>
      ) : (
        <div className="bg-[#080813] border border-cyan-500/20 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(34,211,238,0.05)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono text-slate-300">
              <thead className="bg-[#030308] text-slate-400 uppercase text-[11px] border-b border-cyan-500/20">
                <tr>
                  <th className="p-3">User</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Joined Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => {
                  const isSelf = currentUser?._id === u._id;

                  return (
                    <tr key={u._id} className="hover:bg-[#0c0c1e] transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-slate-100 flex items-center space-x-2">
                          <span>{u.name}</span>
                          {isSelf && (
                            <span className="text-[9px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.2 rounded font-mono uppercase">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-500">{u.email}</div>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${
                            u.role === 'admin'
                              ? 'bg-fuchsia-950/40 text-fuchsia-400 border-fuchsia-500/30'
                              : 'bg-slate-900 text-slate-400 border-slate-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-[11px] text-slate-400 font-mono">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right space-x-1.5">
                        <button
                          disabled={isSelf}
                          onClick={() => setPendingAction({ type: 'role', targetUser: u })}
                          className="text-[11px] bg-[#030308] hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 px-2.5 py-1 rounded font-semibold transition-all disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                          Toggle Role
                        </button>
                        <button
                          disabled={isSelf}
                          onClick={() => setPendingAction({ type: 'delete', targetUser: u })}
                          className="text-[11px] bg-rose-950/30 hover:bg-rose-900/50 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded font-semibold transition-all disabled:opacity-30 disabled:hover:bg-rose-950/30"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="p-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 bg-[#030308]">
              <span>Showing Page {pagination.page} of {pagination.pages} ({pagination.total} total users)</span>
              <div className="flex space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  className="px-3 py-1 bg-[#080813] border border-slate-800 text-slate-300 hover:border-slate-700 rounded disabled:opacity-50 transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={page === pagination.pages}
                  onClick={() => setPage((p) => Math.min(p + 1, pagination.pages))}
                  className="px-3 py-1 bg-[#080813] border border-slate-800 text-slate-300 hover:border-slate-700 rounded disabled:opacity-50 transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}