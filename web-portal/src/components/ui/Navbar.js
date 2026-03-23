'use client';

import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { Sun, Moon, LogOut } from 'lucide-react';

export default function Navbar({ user, showAdminBadge = false, onLogout }) {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-slate-900/95 border-gray-200 dark:border-slate-800 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
        {/* Left */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            CivicConnect
          </Link>

          {showAdminBadge && (
            <span className="px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-800">
              ADMIN
            </span>
          )}

          {user && !showAdminBadge && (
            <span className="hidden md:inline-flex px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400 text-sm font-medium border border-gray-200 dark:border-slate-700">
              Welcome, {user.name}
            </span>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
