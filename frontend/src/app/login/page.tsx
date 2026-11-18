'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();

  // TanStack Query Mutation for handling Login POST request
  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    },
    onSuccess: (data) => {
      // Calls AuthContext login: saves token & redirects by role
      login(data);
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message || 'Something went wrong. Please try again.'
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
          <h1 className="text-2xl font-bold text-primary">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-2">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-accent hover:bg-secondary text-white font-semibold py-2.5 px-4 rounded-lg shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loginMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-accent hover:text-secondary transition-colors underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
