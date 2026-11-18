'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FiUsers,
  FiShield,
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiUserCheck,
  FiAlertCircle,
  FiX,
  FiCheck,
} from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user';
import Button from '@/components/common/Button';
import InputField from '@/components/common/InputField';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';

export default function AdminDashboardPage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<'user' | 'admin'>('user');

  // Notifications
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Guard: Protect route for Admins only
  useEffect(() => {
    if (!authLoading) {
      if (!authUser) {
        router.push('/login');
      } else if (authUser.role !== 'admin') {
        router.push('/profile');
      }
    }
  }, [authUser, authLoading, router]);

  // 2. TanStack Query: Fetch all users
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await api.get('/users');
      return res.data;
    },
    enabled: !!authUser && authUser.role === 'admin',
  });

  // 3. TanStack Query Mutation: Soft Delete User
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/users/${id}`);
      return res.data;
    },
    onSuccess: () => {
      setSuccessMessage('User soft-deleted successfully!');
      // Invalidate cache so the users table refetches immediately!
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message || 'Failed to delete user'
      );
    },
  });

  // 4. TanStack Query Mutation: Update User
  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingUser) return;
      const res = await api.patch(`/users/${editingUser._id}`, {
        name: editName,
        email: editEmail,
        role: editRole,
      });
      return res.data;
    },
    onSuccess: () => {
      setSuccessMessage('User updated successfully!');
      setEditingUser(null);
      // Invalidate cache to show updated user in table
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message || 'Failed to update user'
      );
    },
  });

  // Open Edit Modal
  const openEditModal = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setErrorMessage('');
  };

  // Handle Delete Confirmation
  const handleDelete = (u: User) => {
    if (confirm(`Are you sure you want to delete user "${u.name}"?`)) {
      deleteMutation.mutate(u._id);
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Calculate quick stats
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const regularCount = users.filter((u) => u.role === 'user').length;

  if (authLoading || isLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader size="lg" color="accent" text="Loading user management data..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <Alert
          type="error"
          message="Failed to load users. You may not have administrative permissions."
        />
      </div>
    );
  }

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-primary">
              Admin User Management
            </h1>
            <span className="bg-mint text-primary font-bold text-xs px-2.5 py-1 rounded-full uppercase border border-mint/70">
              Admin Control
            </span>
          </div>
          <p className="text-sm text-secondary mt-1">
            View, edit user roles, and soft-delete user accounts
          </p>
        </div>
      </div>

      {/* Notifications */}
      <Alert
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage('')}
      />
      <Alert
        message={successMessage}
        type="success"
        onClose={() => setSuccessMessage('')}
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
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

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="w-full sm:w-96 relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="border border-gray-200 text-sm font-medium rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-accent text-secondary"
          >
            <option value="all">All Roles</option>
            <option value="user">Users Only</option>
            <option value="admin">Admins Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
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
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-gray-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const isCurrentAdmin = u._id === authUser?._id;

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
                                <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded">
                                  YOU
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-400">ID: {u._id.slice(-6)}</p>
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
                            onClick={() => openEditModal(u)}
                            className="p-2 text-secondary hover:text-white hover:bg-secondary rounded-lg border border-gray-200 transition-colors"
                            title="Edit User"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(u)}
                            disabled={isCurrentAdmin || deleteMutation.isPending}
                            className={`p-2 rounded-lg border transition-colors ${
                              isCurrentAdmin
                                ? 'opacity-30 cursor-not-allowed text-gray-400 border-gray-200'
                                : 'text-rose-600 hover:text-white hover:bg-rose-600 border-rose-200'
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
      </div>

      {/* Edit User Modal Dialog */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                <FiEdit2 className="w-5 h-5 text-accent" />
                Edit User
              </h3>
              <button
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateMutation.mutate();
              }}
              className="mt-5 space-y-4"
            >
              <InputField
                label="Full Name"
                type="text"
                required
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />

              <InputField
                label="Email Address"
                type="email"
                required
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
              />

              <div>
                <label className="block text-sm font-semibold text-secondary mb-1.5">
                  Account Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent text-secondary font-medium"
                >
                  <option value="user">User (Standard)</option>
                  <option value="admin">Admin (Full Access)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={updateMutation.isPending}
                  loadingText="Saving..."
                  icon={<FiCheck className="w-4 h-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
