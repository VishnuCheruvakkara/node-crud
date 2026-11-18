import React from 'react';
import { FiShield, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { User } from '@/types/user';
import Pagination from '@/components/common/Pagination';

interface UserTableProps {
  users: User[];
  currentUserId?: string;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  isDeleting?: boolean;
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (size: number) => void;
}

export default function UserTable({
  users,
  currentUserId,
  onEdit,
  onDelete,
  isDeleting = false,
  totalUsers,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: UserTableProps) {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-primary text-white text-xs font-semibold uppercase tracking-wider">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Email</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm">
            {users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-12 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              users.map((u) => {
                const isCurrentAdmin = u._id === currentUserId;

                return (
                  <tr
                    key={u._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        {u.profileImage ? (
                          <img
                            src={`http://localhost:5000${u.profileImage}`}
                            alt={u.name}
                            className="w-10 h-10 rounded-full object-cover border border-accent"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary text-mint font-bold flex items-center justify-center text-sm border border-accent">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-primary flex items-center gap-1.5">
                            {u.name}
                            {isCurrentAdmin && (
                              <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                                YOU
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400">
                            ID: {u._id.slice(-6)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 text-gray-600 font-medium">
                      {u.email}
                    </td>

                    {/* Role Badge */}
                    <td className="py-4 px-6">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 bg-mint text-primary text-xs font-bold px-2.5 py-1 rounded-full uppercase border border-mint/60">
                          <FiShield className="w-3 h-3" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                          User
                        </span>
                      )}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onEdit(u)}
                          className="p-2 text-secondary hover:text-white hover:bg-secondary rounded-lg border border-gray-200 transition-colors cursor-pointer"
                          title="Edit User"
                          type="button"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onDelete(u)}
                          disabled={isCurrentAdmin || isDeleting}
                          type="button"
                          className={`p-2 rounded-lg border transition-colors ${
                            isCurrentAdmin
                              ? 'opacity-30 cursor-not-allowed text-gray-400 border-gray-200'
                              : 'text-rose-600 hover:text-white hover:bg-rose-600 border-rose-200 cursor-pointer'
                          }`}
                          title={
                            isCurrentAdmin
                              ? 'You cannot delete yourself'
                              : 'Soft Delete User'
                          }
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalUsers}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
      />
    </div>
  );
}
