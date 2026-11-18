'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  // Helper for active link styles using our theme colors
  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `px-3 py-2 rounded-md text-sm font-medium transition-all ${
      isActive
        ? 'bg-secondary text-white shadow-sm'
        : 'text-slate-200 hover:text-mint hover:bg-secondary/50'
    }`;
  };

  return (
    <header className="bg-primary text-white border-b border-secondary sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold tracking-tight text-white hover:opacity-90">
              Auth<span className="text-mint">App</span>
            </Link>

            {/* Navigation (when logged in) */}
            {user && (
              <nav className="hidden md:flex items-center gap-2">
                <Link href="/profile" className={getLinkClass('/profile')}>
                  My Profile
                </Link>

                {/* Admin Only Link */}
                {user.role === 'admin' && (
                  <Link href="/admin" className={getLinkClass('/admin')}>
                    <span className="flex items-center gap-1.5">
                      Admin Dashboard
                      <span className="text-[10px] bg-mint text-primary font-bold px-1.5 py-0.5 rounded uppercase">
                        Admin
                      </span>
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Right Side: Auth Actions */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-8 bg-secondary/50 animate-pulse rounded"></div>
            ) : user ? (
              // Logged in state
              <div className="flex items-center gap-3">
                {/* User avatar and name */}
                <div className="flex items-center gap-2.5">
                  {user.profileImage ? (
                    <img
                      src={`http://localhost:5000${user.profileImage}`}
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-accent"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-secondary text-mint font-semibold flex items-center justify-center text-sm border border-accent">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-semibold text-white leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-mint capitalize mt-0.5 font-medium">
                      {user.role}
                    </p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="ml-2 text-sm text-rose-300 hover:text-white bg-secondary/60 hover:bg-rose-900/60 border border-rose-800/50 px-3 py-1.5 rounded-md font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              // Logged out state
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-200 hover:text-white text-sm font-medium px-3 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-accent hover:bg-secondary text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition-all border border-accent/60"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
