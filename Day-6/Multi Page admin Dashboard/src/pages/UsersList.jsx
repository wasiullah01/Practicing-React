import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { mockUsers } from '../data/mockData';
import { Search, Filter, ChevronRight, UserCircle } from '../components/Icons';

/**
 * UsersList demonstrates:
 * 1. Filters in the URL via `useSearchParams`
 * 2. Bookmarking and sharing state via search params (?search=..., ?status=..., ?role=...)
 * 3. Link to detail route with dynamic IDs (/users/:id)
 */
export const UsersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Read query parameters from URL with defaults
  const querySearch = searchParams.get('q') || '';
  const queryStatus = searchParams.get('status') || 'All';
  const queryRole = searchParams.get('role') || 'All';
  const querySort = searchParams.get('sort') || 'name';

  // Handler to update search params without page reload
  const updateFilters = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const handleReset = () => {
    setSearchParams({});
  };

  // Filter and sort items based on URL search parameters
  const filteredUsers = mockUsers
    .filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(querySearch.toLowerCase()) ||
        u.email.toLowerCase().includes(querySearch.toLowerCase()) ||
        u.department.toLowerCase().includes(querySearch.toLowerCase());
      const matchesStatus = queryStatus === 'All' || u.status === queryStatus;
      const matchesRole = queryRole === 'All' || u.role === queryRole;
      return matchesSearch && matchesStatus && matchesRole;
    })
    .sort((a, b) => {
      if (querySort === 'name') return a.name.localeCompare(b.name);
      if (querySort === 'role') return a.role.localeCompare(b.role);
      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users Directory</h1>
          <p className="text-sm text-slate-400">
            Manage team access, roles, and status
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
            Showing <strong className="text-white">{filteredUsers.length}</strong> of {mockUsers.length}
          </span>
        </div>
      </div>

      {/* Filter Control Bar synced with URL search params */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search name, email..."
              value={querySearch}
              onChange={(e) => updateFilters('q', e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={queryStatus}
              onChange={(e) => updateFilters('status', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <select
              value={queryRole}
              onChange={(e) => updateFilters('role', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Editor">Editor</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={querySort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="name">Sort by Name</option>
              <option value="role">Sort by Role</option>
            </select>
          </div>
        </div>

        {searchParams.toString() && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-700/40 text-xs">
            <span className="text-slate-400">Filtered view active</span>
            <button
              onClick={handleReset}
              className="ml-auto text-rose-400 hover:text-rose-300 font-semibold"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/60 text-slate-400 text-xs uppercase font-semibold border-b border-slate-700/60">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Department</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <p className="text-base font-semibold text-slate-300">No users match your filters</p>
                    <p className="text-xs mt-1">Try resetting the search query or selecting "All" statuses.</p>
                    <button
                      onClick={handleReset}
                      className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded text-xs"
                    >
                      Reset Filters
                    </button>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          {/* Demonstrating Link navigation */}
                          <Link
                            to={`/users/${user.id}`}
                            className="font-semibold text-white hover:text-indigo-400 transition"
                          >
                            {user.name}
                          </Link>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300 font-medium">{user.role}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{user.department}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          user.status === 'Active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : user.status === 'Pending'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => navigate(`/users/${user.id}`)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20 transition"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
