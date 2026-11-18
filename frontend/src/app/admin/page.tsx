'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';
import AdminStats from '@/components/admin/AdminStats';
import AdminFilters from '@/components/admin/AdminFilters';
import UserTable from '@/components/admin/UserTable';
import EditUserModal from '@/components/admin/EditUserModal';

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
  const handleOpenEdit = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setEditName(userToEdit.name);
    setEditEmail(userToEdit.email);
    setEditRole(userToEdit.role);
    setErrorMessage('');
  };

  // Close Edit Modal
  const handleCloseEdit = () => {
    setEditingUser(null);
  };

  // Handle Edit Submit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  // Handle Delete Confirmation
  const handleDeleteUser = (userToDelete: User) => {
    if (confirm(`Are you sure you want to delete user "${userToDelete.name}"?`)) {
      deleteMutation.mutate(userToDelete._id);
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

      {/* Reusable Stats Component */}
      <AdminStats
        totalUsers={totalUsers}
        adminCount={adminCount}
        regularCount={regularCount}
      />

      {/* Reusable Filter Bar Component */}
      <AdminFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      {/* Reusable Users Table Component */}
      <UserTable
        users={filteredUsers}
        currentUserId={authUser?._id}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteUser}
        isDeleting={deleteMutation.isPending}
      />

      {/* Reusable Edit Modal Dialog Component */}
      <EditUserModal
        isOpen={!!editingUser}
        name={editName}
        email={editEmail}
        role={editRole}
        onNameChange={setEditName}
        onEmailChange={setEditEmail}
        onRoleChange={setEditRole}
        onClose={handleCloseEdit}
        onSubmit={handleEditSubmit}
        isSaving={updateMutation.isPending}
      />
    </div>
  );
}
