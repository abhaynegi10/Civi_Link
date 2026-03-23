// src/app/register/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/theme-provider';
import Link from 'next/link';
import { Sun, Moon, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';

export default function RegisterPage() {
  const { darkMode, toggleTheme } = useTheme();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'citizen',
    phone: '',
  });
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
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration Successful! Please Login.');
        router.push('/login');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error. Is backend running?');
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
            Create an account to get started
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
            {/* Role Selector */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">I am a</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'citizen' })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    formData.role === 'citizen'
                      ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  🏙️ Citizen
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'worker' })}
                  className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition-all ${
                    formData.role === 'worker'
                      ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 border-gray-300 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700'
                  }`}
                >
                  🛠️ Worker
                </button>
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500">
                {formData.role === 'citizen'
                  ? 'Report community issues and track their resolution'
                  : 'Browse and apply for local service jobs'}
              </p>
            </div>

            <Input
              label="Full Name"
              name="name"
              type="text"
              required
              placeholder="John Doe"
              onChange={handleChange}
            />

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
              placeholder="Create a password"
              onChange={handleChange}
            />

            {/* Phone — for contact between creators and workers */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              onChange={handleChange}
            />

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">
              Login Here
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}