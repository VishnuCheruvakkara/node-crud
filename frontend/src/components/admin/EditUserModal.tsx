import React, { useRef, useState } from 'react';
import { FiEdit2, FiX, FiCheck, FiCamera } from 'react-icons/fi';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

interface EditUserModalProps {
  isOpen: boolean;
  name: string;
  email: string;
  role: 'user' | 'admin';
  previewUrl: string;
  onImageChange: (file: File | null, preview: string) => void;
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
  previewUrl,
  onImageChange,
  onNameChange,
  onEmailChange,
  onRoleChange,
  onClose,
  onSubmit,
  isSaving = false,
}: EditUserModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageError, setImageError] = useState('');

  if (!isOpen) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        setImageError('Please select JPG, PNG, or WEBP');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError('Image must be less than 5MB');
        return;
      }

      setImageError('');
      onImageChange(file, URL.createObjectURL(file));
    }
  };

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
          {/* Profile Photo Edit */}
          <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="relative group shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={name || 'User'}
                  className="w-16 h-16 rounded-full object-cover border-2 border-accent"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-secondary text-mint font-bold text-xl flex items-center justify-center border-2 border-accent">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change Photo"
              >
                <FiCamera className="w-5 h-5" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFile}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <p className="text-xs font-bold text-primary">User Avatar</p>
              <p className="text-[11px] text-gray-500 mt-0.5">JPG, PNG or WEBP (Max 5MB)</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:text-secondary border border-accent/40 hover:border-secondary px-2.5 py-1 rounded transition-colors cursor-pointer"
              >
                <FiCamera className="w-3 h-3" />
                <span>Upload New Image</span>
              </button>
              {imageError && (
                <p className="text-[11px] text-rose-600 mt-1">{imageError}</p>
              )}
            </div>
          </div>

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
              disabled={isSaving}
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
