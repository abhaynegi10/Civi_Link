// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Trash2, Upload, Loader2, ChevronDown, ChevronUp, CheckCircle, XCircle, User, Phone, Mail } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Report data
  const [reports, setReports] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);

  // Applications
  const [expandedReport, setExpandedReport] = useState(null);
  const [applications, setApplications] = useState({});

  // Auth & Fetch
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchReports();
      setLoading(false);
    }
  }, [router]);

  const fetchReports = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  const fetchApplications = async (reportId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/report/${reportId}`);
      const data = await res.json();
      setApplications((prev) => ({ ...prev, [reportId]: data }));
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  };

  const toggleApplications = (reportId) => {
    if (expandedReport === reportId) {
      setExpandedReport(null);
    } else {
      setExpandedReport(reportId);
      if (!applications[reportId]) {
        fetchApplications(reportId);
      }
    }
  };

  const handleApplicationAction = async (appId, status, reportId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchApplications(reportId);
        fetchReports();
        alert(`Application ${status}!`);
      }
    } catch (err) {
      alert('Error updating application');
    }
  };

  const handleDelete = async (reportId) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/reports/${reportId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setReports(reports.filter((r) => r.id !== reportId));
        alert('Deleted successfully');
      }
    } catch (err) {
      alert('Error deleting report');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', desc);
    formData.append('location', location);
    formData.append('user_id', user.id);
    if (file) {
      formData.append('image', file);
    }

    try {
      const res = await fetch('http://localhost:5000/api/reports', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setTitle('');
        setDesc('');
        setLocation('');
        setFile(null);
        document.getElementById('fileInput').value = '';
        fetchReports();
        alert('Report Submitted Successfully!');
      } else {
        alert('Failed to submit report.');
      }
    } catch (err) {
      alert('Server error.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const statusBadge = (status) => {
    switch (status) {
      case 'in_progress': return <Badge color="blue">In Progress</Badge>;
      case 'resolved': return <Badge color="emerald">Resolved</Badge>;
      default: return <Badge color="gray">Open</Badge>;
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

      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── LEFT: REPORT FORM ── */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-20">
            <Card className="p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">
                Report an Issue
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Broken Pipe"
                />

                <Input
                  label="Location"
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Sector 5, Block A"
                />

                <Input
                  label="Description"
                  textarea
                  required
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe the issue in detail..."
                />

                {/* File input */}
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300">
                    Upload Photo (Optional)
                  </label>
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="w-full text-sm text-gray-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-gray-300 dark:file:border-slate-600 file:text-sm file:font-medium file:bg-white dark:file:bg-slate-800 file:text-gray-700 dark:file:text-slate-300 hover:file:bg-gray-50 dark:hover:file:bg-slate-700 file:cursor-pointer file:transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>

        {/* ── RIGHT: FEED ── */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Community Feed
            </h2>
            <span className="text-sm text-gray-500 dark:text-slate-400">
              {reports.length} report{reports.length !== 1 ? 's' : ''}
            </span>
          </div>

          {reports.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-400 dark:text-slate-500">No reports yet. Be the first to submit one!</p>
            </Card>
          )}

          {reports.map((report) => (
            <Card key={report.id} hoverable className="overflow-hidden">
              <div className="flex flex-col sm:flex-row">
                {/* Image thumbnail */}
                {report.image_url && (
                  <div className="sm:w-48 sm:min-h-[160px] bg-gray-100 dark:bg-slate-800 shrink-0">
                    <img
                      src={`http://localhost:5000${report.image_url}`}
                      alt={report.title}
                      className="w-full h-48 sm:h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <Badge color={report.category === 'government' ? 'amber' : 'emerald'}>
                          {report.category === 'government' ? '🏛 Government' : '🛠 Service'}
                        </Badge>
                        {statusBadge(report.status)}
                        <span className="text-xs text-gray-400 dark:text-slate-500">
                          #{report.id}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">
                        {report.title}
                      </h3>

                      <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 mb-3">
                        <MapPin size={13} />
                        <span>{report.location}</span>
                      </div>

                      <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {report.description}
                      </p>
                    </div>

                    {/* Delete — only visible to the report owner */}
                    {user?.id === report.user_id && (
                      <button
                        onClick={() => handleDelete(report.id)}
                        className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
                        title="Delete Report"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Footer with applications toggle */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          report.category === 'government' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      <span className="text-xs text-gray-500 dark:text-slate-500">
                        {report.category === 'government' ? 'Pending Govt Action' : 'Open for Workers'}
                      </span>
                    </div>

                    {/* Show applications toggle only for service reports owned by this user */}
                    {report.category === 'service' && user?.id === report.user_id && (
                      <button
                        onClick={() => toggleApplications(report.id)}
                        className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View Applications
                        {expandedReport === report.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Applications Section */}
              {expandedReport === report.id && (
                <div className="border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 p-5">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-3">
                    Worker Applications
                  </h4>

                  {!applications[report.id] ? (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Loader2 size={14} className="animate-spin" /> Loading...
                    </div>
                  ) : applications[report.id].length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-slate-500">No applications yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {applications[report.id].map((app) => (
                        <div
                          key={app.id}
                          className="p-4 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {app.worker_name}
                                </span>
                                <Badge
                                  color={
                                    app.status === 'accepted' ? 'emerald' : app.status === 'rejected' ? 'red' : 'amber'
                                  }
                                >
                                  {app.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500 dark:text-slate-400 italic mb-2">
                                &quot;{app.message}&quot;
                              </p>

                              {/* Show contact after acceptance */}
                              {app.status === 'accepted' && (
                                <div className="space-y-1 text-sm text-gray-600 dark:text-slate-400">
                                  <div className="flex items-center gap-2">
                                    <Mail size={13} />
                                    <a href={`mailto:${app.worker_email}`} className="text-blue-600 dark:text-blue-400 underline">{app.worker_email}</a>
                                  </div>
                                  {app.worker_phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone size={13} />
                                      <a href={`tel:${app.worker_phone}`} className="text-blue-600 dark:text-blue-400 underline">{app.worker_phone}</a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Accept/Reject buttons */}
                            {app.status === 'pending' && (
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => handleApplicationAction(app.id, 'accepted', report.id)}
                                  className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
                                  title="Accept"
                                >
                                  <CheckCircle size={18} />
                                </button>
                                <button
                                  onClick={() => handleApplicationAction(app.id, 'rejected', report.id)}
                                  className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle size={18} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}