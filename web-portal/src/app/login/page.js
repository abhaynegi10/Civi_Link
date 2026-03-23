// src/app/login/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import Link from 'next/link';
import { Sun, Moon, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function LoginPage() {
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 'admin') {
          router.push('/admin');
        } else if (data.user.role === 'worker') {
          router.push('/worker');
        } else {
          router.push('/dashboard');
        }
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Cannot connect to server. Ensure Backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors"
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
            CivicConnect
          </Link>
          <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
            Sign in to manage your community
          </p>
        </div>

        <Card className="p-8">
          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Email Address"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              onChange={handleChange}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              onChange={handleChange}
            />

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Register Now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}