'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';
import Alert from '@/components/common/Alert';
import InputField from '@/components/common/InputField';
import Button from '@/components/common/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      login(data);
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message || 'Invalid email or password'
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    loginMutation.mutate();
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-mint/40 text-primary rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <FiLogIn className="w-6 h-6 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Reusable Alert / Validation Message */}
        <Alert
          message={errorMessage}
          type="error"
          onClose={() => setErrorMessage('')}
          className="mb-5"
        />

        {/* Form with Reusable Input Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            icon={<FiMail className="w-4 h-4" />}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            icon={<FiLock className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={loginMutation.isPending}
            loadingText="Signing in..."
            icon={<FiLogIn className="w-4 h-4" />}
            className="w-full mt-2"
          >
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-accent hover:text-secondary transition-colors underline"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}
