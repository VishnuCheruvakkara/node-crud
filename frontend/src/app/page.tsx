'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="inline-block bg-mint text-primary font-semibold text-xs uppercase px-3 py-1 rounded-full mb-6 tracking-wide shadow-sm">
        Next.js & Node.js Authentication System
      </div>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-primary tracking-tight max-w-2xl">
        Secure Auth & User Management App
      </h1>

      <p className="mt-4 text-lg text-secondary max-w-xl">
        Built with JWT token security, role-based access control (Admin & User),
        image uploads, and MongoDB soft delete.
      </p>

      <div className="mt-8 flex gap-4">
        {user ? (
          <Link
            href={user.role === 'admin' ? '/admin' : '/profile'}
            className="bg-accent hover:bg-secondary text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all"
          >
            Go to {user.role === 'admin' ? 'Admin Dashboard' : 'My Profile'}
          </Link>
        ) : (
          <>
            <Link
              href="/login"
              className="bg-accent hover:bg-secondary text-white font-medium px-6 py-3 rounded-lg shadow-md transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-white hover:bg-gray-50 text-secondary border border-gray-300 font-medium px-6 py-3 rounded-lg shadow-sm transition-all"
            >
              Create Account
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
