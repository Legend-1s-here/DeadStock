'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Package, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError(null);
    setEmail(demoEmail);
    setPassword('password123');

    const res = await signIn('credentials', {
      redirect: false,
      email: demoEmail,
      password: 'password123',
      callbackUrl,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-slate-900 text-orange-500 rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Package className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Sign In to DeadStock
          </h2>
          <p className="text-xs text-slate-500">
            Access your B2B seller dashboard, manage offers, and negotiate bulk deals.
          </p>
        </div>

        {/* 1-CLICK DEMO ACCOUNTS */}
        <div className="bg-orange-50/70 p-4 rounded-2xl border border-orange-200/80 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-orange-800">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <span>Instant 1-Click Demo Login</span>
          </div>
          <p className="text-[11px] text-orange-700 leading-snug">
            Evaluate the platform immediately as a verified merchant persona:
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('spice.garden@demo.com')}
              disabled={loading}
              className="w-full text-left p-2.5 bg-white hover:bg-orange-100/60 rounded-xl border border-orange-200 text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900 block">🍽️ Rajesh Kumar (Seller)</strong>
                <span className="text-[10px] text-slate-500">Spice Garden Restaurant • Mumbai</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('trendz.store@demo.com')}
              disabled={loading}
              className="w-full text-left p-2.5 bg-white hover:bg-orange-100/60 rounded-xl border border-orange-200 text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900 block">👗 Neha Sharma (Buyer)</strong>
                <span className="text-[10px] text-slate-500">Trendz Boutiques • Delhi NCR</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
            </button>

            <button
              type="button"
              onClick={() => handleDemoLogin('techbridge@demo.com')}
              disabled={loading}
              className="w-full text-left p-2.5 bg-white hover:bg-orange-100/60 rounded-xl border border-orange-200 text-xs transition-colors flex items-center justify-between"
            >
              <div>
                <strong className="text-slate-900 block">💻 Vikram Mehta (IT Office Admin)</strong>
                <span className="text-[10px] text-slate-500">TechBridge Solutions • Bangalore</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-orange-600" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Regular Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Business Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="owner@business.com"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with Business Credentials'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-slate-500">
          New commercial enterprise?{' '}
          <Link href="/auth/register" className="font-bold text-orange-600 hover:underline">
            Register your business profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading sign in...</div>}>
      <LoginForm />
    </Suspense>
  );
}
