// src/app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Landmark, Wrench, AlertTriangle, Download, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import StatCard from '@/components/ui/StatCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (!storedUser) {
      router.push('/login');
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'admin') {
        alert('ACCESS DENIED: You are not an Admin.');
        router.push('/dashboard');
      } else {
        setUser(userData);
        fetchReports();
        setLoading(false);
      }
    }
  }, [router]);

  const fetchReports = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports`);
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const deleteReport = async (id) => {
    if (!confirm('Are you sure you want to delete this report? This cannot be undone.')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReports(reports.filter((r) => r.id !== id));
        alert('Report Deleted Successfully');
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Server Error');
    }
  };

  // Dynamic stats
  const totalReports = reports.length;
  const govtIssues = reports.filter((r) => r.category === 'government').length;
  const serviceJobs = reports.filter((r) => r.category === 'service').length;
  const openIssues = reports.length;

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 size={24} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-200">
      <Navbar user={user} showAdminBadge onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* ── STATS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Reports" value={totalReports} icon={FileText} accentColor="blue" />
          <StatCard label="Govt Issues" value={govtIssues} icon={Landmark} accentColor="amber" />
          <StatCard label="Service Jobs" value={serviceJobs} icon={Wrench} accentColor="emerald" />
          <StatCard label="Active Issues" value={openIssues} icon={AlertTriangle} accentColor="purple" />
        </div>

        {/* ── DATA TABLE ── */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Master Report List
            </h2>
            <Button variant="secondary" size="sm">
              <Download size={14} />
              Export CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs uppercase tracking-wider font-semibold text-gray-500 dark:text-slate-400 border-b border-gray-200 dark:border-slate-800">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Location</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Image</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {reports.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-400 dark:text-slate-500">
                      No reports found in database.
                    </td>
                  </tr>
                )}
                {reports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-sm text-gray-400 dark:text-slate-500">
                      #{report.id}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-slate-200">
                      {report.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-slate-400">
                      {report.location}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        color={report.category === 'government' ? 'amber' : 'emerald'}
                      >
                        {report.category}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      {report.image_url ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}${report.image_url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline text-sm"
                        >
                          View
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-slate-500">
                          No Image
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteReport(report.id)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
}