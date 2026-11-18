import React from 'react';
import { FiAlertTriangle, FiX, FiTrash2 } from 'react-icons/fi';
import { User } from '@/types/user';
import Button from '@/components/common/Button';

interface DeleteUserModalProps {
  isOpen: boolean;
  user: User | null;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export default function DeleteUserModal({
  isOpen,
  user,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5 text-rose-600">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-primary">Confirm Deletion</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md cursor-pointer"
            type="button"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-4 space-y-3">
          <p className="text-sm text-gray-600">
            Are you sure you want to delete this user?
          </p>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="font-semibold text-primary text-sm">{user.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-200 text-gray-700">
              Role: {user.role}
            </span>
          </div>

          <p className="text-xs text-rose-600 font-medium">
            Note: This user account will be soft-deleted. They will be logged out and unable to access the system.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-5 mt-5 border-t border-gray-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={onConfirm}
            isLoading={isDeleting}
            loadingText="Deleting..."
            icon={<FiTrash2 className="w-4 h-4" />}
          >
            Delete User
          </Button>
        </div>
      </div>
    </div>
  );
}
