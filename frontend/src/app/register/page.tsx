'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { login } = useAuth();

  // TanStack Query Mutation for Register POST request
  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post('/auth/register', { name, email, password });
      return res.data;
    },
    onSuccess: (data) => {
      // Auto-login upon successful registration
      login(data);
    },
    onError: (err: any) => {
      setErrorMessage(
        err.response?.data?.message || 'Registration failed. Please try again.'
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validations
    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    registerMutation.mutate();
  };

  return (
    <div className="flex justify-center items-center py-12">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary">Create an Account</h1>
          <p className="text-sm text-gray-500 mt-2">
            Join us to get started with your account
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alice Wonderland"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alice@example.com"
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

          <div>
            <label className="block text-sm font-semibold text-secondary mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="w-full mt-2 bg-accent hover:bg-secondary text-white font-semibold py-2.5 px-4 rounded-lg shadow transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {registerMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Footer Link */}
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
