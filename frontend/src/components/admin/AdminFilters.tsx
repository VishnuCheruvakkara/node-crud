import React from 'react';
import { FiSearch } from 'react-icons/fi';

interface AdminFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  roleFilter: 'all' | 'user' | 'admin';
  onRoleFilterChange: (role: 'all' | 'user' | 'admin') => void;
}

export default function AdminFilters({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange,
}: AdminFiltersProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
      {/* Search Input */}
      <div className="w-full sm:w-96 relative">
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
        />
      </div>

      {/* Role Filter Dropdown */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <label htmlFor="role-filter" className="text-xs font-semibold text-gray-500">
          Filter Role:
        </label>
        <select
          id="role-filter"
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value as 'all' | 'user' | 'admin')}
          className="border border-gray-200 text-sm font-medium rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent text-secondary cursor-pointer"
        >
          <option value="all">All Roles</option>
          <option value="user">Users Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>
    </div>
  );
}
