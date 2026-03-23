// src/app/page.js
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme-provider';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Sun, Moon, Camera, Cpu, CheckCircle, ArrowRight, Shield, Users, Wrench } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function LandingPage() {
  const { darkMode, toggleTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Refs for parallax sections
  const heroRef = useRef(null);
  const rolesRef = useRef(null);
  const howRef = useRef(null);

  // Hero parallax — text rises slower than scroll
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroTextY = useTransform(heroScroll, [0, 1], prefersReducedMotion ? [0, 0] : [0, 80]);
  const heroBlobY = useTransform(heroScroll, [0, 1], prefersReducedMotion ? [0, 0] : [0, 140]);
  const heroOpacity = useTransform(heroScroll, [0, 0.6], [1, 0]);

  // Roles section — cards float up
  const { scrollYProgress: rolesScroll } = useScroll({
    target: rolesRef,
    offset: ['start end', 'end start'],
  });
  const rolesY = useTransform(rolesScroll, [0, 0.5], prefersReducedMotion ? [0, 0] : [60, 0]);
  const rolesOpacity = useTransform(rolesScroll, [0, 0.3], [0, 1]);

  // How it works
  const { scrollYProgress: howScroll } = useScroll({
    target: howRef,
    offset: ['start end', 'end start'],
  });
  const howY = useTransform(howScroll, [0, 0.5], prefersReducedMotion ? [0, 0] : [40, 0]);
  const howOpacity = useTransform(howScroll, [0, 0.3], [0, 1]);

  const roleCards = [
    {
      title: 'Citizen',
      desc: 'Report broken streetlights, potholes, garbage, or any community issue that needs attention.',
      icon: Users,
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      link: '/dashboard',
      buttonVariant: 'primary',
      buttonText: 'Report Issues',
    },
    {
      title: 'Worker',
      desc: 'Plumber, electrician, mechanic? Browse open service jobs and apply to help your community.',
      icon: Wrench,
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      link: '/worker',
      buttonVariant: 'secondary',
      buttonText: 'Find Jobs',
    },
    {
      title: 'Administration',
      desc: 'Monitor city issues, oversee AI classifications, manage users, and analyze community data.',
      icon: Shield,
      iconBg: 'bg-red-50 dark:bg-red-900/30',
      iconColor: 'text-red-600 dark:text-red-400',
      link: '/admin',
      buttonVariant: 'secondary',
      buttonText: 'Admin Login',
    },
  ];

  const howSteps = [
    {
      title: '1. Report',
      icon: Camera,
      desc: 'Snap a photo of the problem and describe the issue with location details.',
    },
    {
      title: '2. AI Sorts',
      icon: Cpu,
      desc: 'Our AI engine automatically categorizes: Government issue or Private service need.',
    },
    {
      title: '3. Resolved',
      icon: CheckCircle,
      desc: 'Officials address civic issues, or local skilled workers get matched to service jobs.',
    },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-gray-900 dark:text-slate-100 overflow-hidden">

      {/* ── NAVBAR ── */}
      <nav className="sticky top-0 z-50 border-b bg-white/95 dark:bg-slate-950/95 border-gray-200 dark:border-slate-800 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            CivicConnect
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-slate-200 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/login">
              <Button variant="secondary" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button variant="primary" size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO (with parallax) ── */}
      <header ref={heroRef} className="relative overflow-hidden">
        {/* Background gradient — moves slower (depth effect) */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950" />

        {/* Decorative blobs — parallax background layer */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ y: heroBlobY }}
        >
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-200/20 dark:bg-blue-500/5 rounded-full blur-3xl" />
          <div className="absolute top-32 right-1/4 w-96 h-96 bg-indigo-200/15 dark:bg-indigo-500/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-sky-200/20 dark:bg-sky-500/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Hero content — parallax foreground */}
        <motion.div
          className="relative max-w-7xl mx-auto px-6 pt-20 pb-24 text-center"
          style={{ y: heroTextY, opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6"
          >
            <Cpu size={14} />
            AI-Powered Community Management
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]"
          >
            Fix Your Neighborhood.
            <br />
            <span className="text-blue-600 dark:text-blue-400">Find Local Work.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="text-lg md:text-xl text-gray-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            We use AI to route your complaints: Government issues go to the officials,
            service needs go to local freelancers.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Report an Issue
                <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Sign In to Dashboard
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </header>

      {/* ── ROLE SELECTION (with scroll reveal + parallax) ── */}
      <section ref={rolesRef} className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          className="grid md:grid-cols-3 gap-6"
          style={{ y: rolesY, opacity: rolesOpacity }}
        >
          {roleCards.map((role, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Card hoverable className="p-8 card-hover">
                <div className={`w-12 h-12 rounded-lg ${role.iconBg} flex items-center justify-center mb-5`}>
                  <role.icon size={22} className={role.iconColor} />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{role.title}</h2>
                <p className="text-gray-600 dark:text-slate-400 mb-6 leading-relaxed">{role.desc}</p>
                <Link href={role.link}>
                  <Button variant={role.buttonVariant} className="w-full">
                    {role.buttonText}
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS (with scroll reveal + parallax) ── */}
      <section ref={howRef} className="border-t border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-12"
          >
            How It Works
          </motion.h3>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            style={{ y: howY, opacity: howOpacity }}
          >
            {howSteps.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
              >
                <Card className="p-6 text-center card-hover">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
                    <item.icon size={22} className="text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-gray-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-gray-500 dark:text-slate-500">
          © {new Date().getFullYear()} CivicConnect. Built for better communities.
        </div>
      </footer>
    </main>
  );
}