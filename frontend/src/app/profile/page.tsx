'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiUser, FiMail, FiCamera, FiShield, FiCheckCircle } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types/user';
import Button from '@/components/common/Button';
import InputField from '@/components/common/InputField';
import Alert from '@/components/common/Alert';
import Loader from '@/components/common/Loader';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading, updateUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Protected Route Guard: Redirect to /login if not logged in
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push('/login');
    }
  }, [authUser, authLoading, router]);

  // 2. Fetch fresh user profile from backend using TanStack Query
  const {
    data: profile,
    isLoading: isProfileLoading,
    error: profileError,
  } = useQuery<User>({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/users/profile');
      return res.data;
    },
    enabled: !!authUser, // Only run if user is logged in
  });

  // Sync state when fresh profile data arrives
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      if (profile.profileImage) {
        setPreviewUrl(`http://localhost:5000${profile.profileImage}`);
      }
    }
  }, [profile]);

  // 3. Handle image file selection with preview
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
        setErrorMessage('Please select a valid image file (JPG, PNG, or WEBP)');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('Image size must be less than 5MB');
        return;
      }

      setErrorMessage('');
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 4. TanStack Query Mutation: Update Profile & Image Upload
  const updateMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('name', name);

      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const res = await api.patch('/users/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data;
    },
    onSuccess: (updatedData: User) => {
      setSuccessMessage('Profile updated successfully!');
      setSelectedFile(null);

      // Update global AuthContext state so Navbar updates in real time
      updateUser(updatedData);

      // Invalidate profile query to ensure cache is fresh
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      setTimeout(() => setSuccessMessage(''), 4000);
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message || 'Failed to update profile. Please try again.'
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    updateMutation.mutate();
  };

  if (authLoading || isProfileLoading) {
    return (
      <div className="py-24 flex items-center justify-center">
        <Loader size="lg" color="accent" text="Loading your profile..." />
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="max-w-xl mx-auto py-12">
        <Alert type="error" message="Failed to load profile. Please log in again." />
      </div>
    );
  }

  const currentRole = profile?.role || authUser?.role;

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Title */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Profile</h1>
          <p className="text-sm text-secondary mt-1">
            Manage your personal account details and profile photo
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-mint text-primary shadow-sm border border-mint/70">
          <FiShield className="w-3.5 h-3.5" />
          <span>{currentRole}</span>
        </div>
      </div>

      {/* Notifications */}
      <Alert
        message={errorMessage}
        type="error"
        onClose={() => setErrorMessage('')}
        className="mb-6"
      />

      <Alert
        message={successMessage}
        type="success"
        onClose={() => setSuccessMessage('')}
        className="mb-6"
      />

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100">
            <div className="relative group">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={name || 'User'}
                  className="w-28 h-28 rounded-full object-cover border-4 border-accent shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-secondary text-mint font-bold text-3xl flex items-center justify-center border-4 border-accent shadow-md">
                  {name ? name.charAt(0).toUpperCase() : 'U'}
                </div>
              )}

              {/* Overlay camera button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Change Photo"
              >
                <FiCamera className="w-6 h-6" />
                <span className="text-[11px] font-semibold mt-1">Upload</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-primary">Profile Photo</h2>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Upload a JPG, PNG, or WEBP photo (max 5MB). Click the avatar or the button below.
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-accent hover:text-secondary border border-accent/40 hover:border-secondary px-3 py-1.5 rounded-md transition-colors"
              >
                <FiCamera className="w-3.5 h-3.5" />
                <span>Choose Image</span>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <InputField
              label="Full Name"
              type="text"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              icon={<FiUser className="w-4 h-4" />}
            />

            <div>
              <label className="block text-sm font-semibold text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiMail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={profile?.email || authUser?.email || ''}
                  className="w-full py-2.5 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                />
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Email address cannot be changed directly for security.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={updateMutation.isPending}
              loadingText="Saving Changes..."
              icon={<FiCheckCircle className="w-4 h-4" />}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
