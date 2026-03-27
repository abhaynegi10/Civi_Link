// src/app/worker/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Send, Loader2, CheckCircle, XCircle, Clock, Phone, Mail, User } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function WorkerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'applications'

  // Data
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applyingTo, setApplyingTo] = useState(null); // report id being applied to
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'worker') {
        router.push('/dashboard');
        return;
      }
      setUser(userData);
      fetchJobs();
      fetchApplications(userData.id);
      setLoading(false);
    }
  }, [router]);

  const fetchJobs = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reports/service-jobs`);
      const data = await res.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    }
  };

  const fetchApplications = async (workerId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications/worker/${workerId}`);
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const handleApply = async (reportId) => {
    if (!message.trim()) return alert('Please write a message');
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report_id: reportId,
          worker_id: user.id,
          message: message.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Application submitted!');
        setApplyingTo(null);
        setMessage('');
        fetchApplications(user.id);
        fetchJobs();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Server error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  // Check if already applied to a job
  const hasApplied = (reportId) => {
    return applications.some((a) => a.report_id === reportId);
  };

  const statusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'rejected': return <XCircle size={14} className="text-red-500" />;
      default: return <Clock size={14} className="text-amber-500" />;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case 'accepted': return 'emerald';
      case 'rejected': return 'red';
      default: return 'amber';
    }
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
      <Navbar user={user} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Worker Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Browse open service jobs and apply</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'jobs'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
            }`}
          >
            Open Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'applications'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300'
            }`}
          >
            My Applications ({applications.length})
          </button>
        </div>

        {/* --- JOBS TAB --- */}
        {activeTab === 'jobs' && (
          <div className="space-y-4">
            {jobs.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-400 dark:text-slate-500">No open service jobs right now. Check back later!</p>
              </Card>
            )}

            {jobs.map((job) => (
              <Card key={job.id} hoverable className="overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {job.image_url && (
                    <div className="sm:w-48 sm:min-h-[160px] bg-gray-100 dark:bg-slate-800 shrink-0">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API_URL}${job.image_url}`}
                        alt={job.title}
                        className="w-full h-48 sm:h-full object-cover"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                      />
                    </div>
                  )}

                  <div className="flex-1 p-5">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <Badge color="emerald">🛠 Service Job</Badge>
                      <span className="text-xs text-gray-400 dark:text-slate-500">#{job.id}</span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{job.title}</h3>

                    <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 mb-2">
                      <MapPin size={13} />
                      <span>{job.location}</span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-4">{job.description}</p>

                    <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-slate-500 mb-4">
                      <User size={12} />
                      <span>Posted by {job.creator_name}</span>
                    </div>

                    {/* Apply section */}
                    {hasApplied(job.id) ? (
                      <Badge color="blue">✓ Already Applied</Badge>
                    ) : applyingTo === job.id ? (
                      <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-slate-800">
                        <textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Introduce yourself and why you're a good fit..."
                          rows={3}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => handleApply(job.id)} disabled={submitting}>
                            {submitting ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Send size={14} /> Submit Application</>}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => { setApplyingTo(null); setMessage(''); }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button size="sm" onClick={() => setApplyingTo(job.id)}>
                        Apply for Job
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* --- APPLICATIONS TAB --- */}
        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.length === 0 && (
              <Card className="p-12 text-center">
                <p className="text-gray-400 dark:text-slate-500">You haven&apos;t applied to any jobs yet.</p>
              </Card>
            )}

            {applications.map((app) => (
              <Card key={app.id} className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{app.report_title}</h3>
                      <Badge color={statusColor(app.status)}>
                        {statusIcon(app.status)}
                        <span className="ml-1 capitalize">{app.status}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-1.5 mb-2">
                      <MapPin size={13} /> {app.report_location}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-slate-400 italic">&quot;{app.message}&quot;</p>
                  </div>
                </div>

                {/* Show creator contact if accepted */}
                {app.status === 'accepted' && (
                  <div className="mt-4 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-2">🎉 You've been accepted! Contact the poster:</p>
                    <div className="space-y-1.5 text-sm text-emerald-800 dark:text-emerald-300">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>{app.creator_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <a href={`mailto:${app.creator_email}`} className="underline">{app.creator_email}</a>
                      </div>
                      {app.creator_phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={14} />
                          <a href={`tel:${app.creator_phone}`} className="underline">{app.creator_phone}</a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
