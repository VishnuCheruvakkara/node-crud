import React from 'react';
import { FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

interface EditUserModalProps {
  isOpen: boolean;
  name: string;
  email: string;
  role: 'user' | 'admin';
  onNameChange: (val: string) => void;
  onEmailChange: (val: string) => void;
  onRoleChange: (val: 'user' | 'admin') => void;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSaving?: boolean;
}

export default function EditUserModal({
  isOpen,
  name,
  email,
  role,
  onNameChange,
  onEmailChange,
  onRoleChange,
  onClose,
  onSubmit,
  isSaving = false,
}: EditUserModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-primary flex items-center gap-2">
            <FiEdit2 className="w-5 h-5 text-accent" />
            Edit User
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer"
            type="button"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <InputField
            label="Full Name"
            type="text"
            required
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
          />

          <InputField
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
          />

          <div>
            <label
              htmlFor="edit-role-select"
              className="block text-sm font-semibold text-secondary mb-1.5"
            >
              Account Role
            </label>
            <select
              id="edit-role-select"
              value={role}
              onChange={(e) => onRoleChange(e.target.value as 'user' | 'admin')}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-accent text-secondary font-medium cursor-pointer"
            >
              <option value="user">User (Standard)</option>
              <option value="admin">Admin (Full Access)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              loadingText="Saving..."
              icon={<FiCheck className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
