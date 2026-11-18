'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiUser, FiShield, FiLogOut, FiLogIn, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '@/context/AuthContext';
import Loader from '@/components/common/Loader';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `px-3 py-2 rounded-md text-sm font-medium transition-all inline-flex items-center gap-1.5 ${
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
            <Link href="/" className="text-xl font-bold tracking-tight text-white hover:opacity-90 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-black text-white text-base shadow">
                A
              </span>
              <span>
                Auth<span className="text-mint">App</span>
              </span>
            </Link>

            {/* Navigation (when logged in) */}
            {user && (
              <nav className="hidden md:flex items-center gap-2">
                <Link href="/profile" className={getLinkClass('/profile')}>
                  <FiUser className="w-4 h-4 text-mint" />
                  <span>My Profile</span>
                </Link>

                {/* Admin Only Link */}
                {user.role === 'admin' && (
                  <Link href="/admin" className={getLinkClass('/admin')}>
                    <FiShield className="w-4 h-4 text-amber-300" />
                    <span>Admin Dashboard</span>
                    <span className="text-[10px] bg-mint text-primary font-bold px-1.5 py-0.5 rounded uppercase ml-1">
                      Admin
                    </span>
                  </Link>
                )}
              </nav>
            )}
          </div>

          {/* Right Side: Auth Actions */}
          <div className="flex items-center gap-4">
            {loading ? (
              <Loader size="sm" color="mint" />
            ) : user ? (
              // Logged in state
              <div className="flex items-center gap-3">
                {/* User avatar and name */}
                <Link
                  href="/profile"
                  className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-secondary/40 transition-colors"
                >
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
                </Link>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="ml-2 text-sm text-rose-300 hover:text-white bg-secondary/60 hover:bg-rose-900/60 border border-rose-800/50 px-3 py-1.5 rounded-md font-medium transition-colors inline-flex items-center gap-1.5"
                >
                  <FiLogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              // Logged out state
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-slate-200 hover:text-white text-sm font-medium px-3 py-2 rounded-md transition-colors inline-flex items-center gap-1.5"
                >
                  <FiLogIn className="w-4 h-4 text-mint" />
                  <span>Login</span>
                </Link>
                <Link
                  href="/register"
                  className="bg-accent hover:bg-secondary text-white text-sm font-medium px-4 py-2 rounded-md shadow-sm transition-all border border-accent/60 inline-flex items-center gap-1.5"
                >
                  <FiUserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
