import React from 'react';
import { FiUsers, FiShield, FiUserCheck } from 'react-icons/fi';

interface AdminStatsProps {
  totalUsers: number;
  adminCount: number;
  regularCount: number;
}

export default function AdminStats({
  totalUsers,
  adminCount,
  regularCount,
}: AdminStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {/* Total Users */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-blue-50 text-accent flex items-center justify-center text-xl">
          <FiUsers />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Total Users
          </p>
          <p className="text-2xl font-bold text-primary mt-0.5">{totalUsers}</p>
        </div>
      </div>

      {/* Administrators */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-xl">
          <FiShield />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Administrators
          </p>
          <p className="text-2xl font-bold text-primary mt-0.5">{adminCount}</p>
        </div>
      </div>

      {/* Regular Users */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl">
          <FiUserCheck />
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase">
            Regular Users
          </p>
          <p className="text-2xl font-bold text-primary mt-0.5">
            {regularCount}
          </p>
        </div>
      </div>
    </div>
  );
}
