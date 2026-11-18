'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { FiUser, FiMail, FiLock, FiUserPlus } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';
import Alert from '@/components/common/Alert';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Field-specific validation errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState('');

  const { login } = useAuth();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    },
    onSuccess: (data) => {
      login(data);
    },
    onError: (err: any) => {
      setServerError(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    },
  });

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (!validate()) return;

    registerMutation.mutate();
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-mint/40 text-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FiUserPlus className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign up to get started with your account
          </p>
        </div>

        {/* Server Error Alert */}
        <Alert
          message={serverError}
          type="error"
          onClose={() => setServerError('')}
          className="mb-5"
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Full Name"
            type="text"
            name="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
            }}
            placeholder="Alice Wonderland"
            icon={<FiUser className="w-4 h-4" />}
            error={errors.name}
          />

          <InputField
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
            }}
            placeholder="alice@example.com"
            icon={<FiMail className="w-4 h-4" />}
            error={errors.email}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
            }}
            placeholder="••••••••"
            icon={<FiLock className="w-4 h-4" />}
            error={errors.password}
          />

          <InputField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors((prev) => ({ ...prev, confirmPassword: '' }));
            }}
            placeholder="••••••••"
            icon={<FiLock className="w-4 h-4" />}
            error={errors.confirmPassword}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={registerMutation.isPending}
            loadingText="Creating account..."
            icon={<FiUserPlus className="w-4 h-4" />}
            className="w-full mt-2"
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-accent hover:text-secondary transition-colors underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
