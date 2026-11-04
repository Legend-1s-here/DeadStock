'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Package,
  PlusCircle,
  Search,
  Sparkles,
  LayoutDashboard,
  User,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Building2,
  ChevronDown,
} from 'lucide-react';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform border border-slate-700">
              <Package className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  DEAD<span className="text-orange-500">STOCK</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-sm">
                  B2B
                </span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:inline -mt-0.5">
                Surplus Commercial Assets
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/browse"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/browse')
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              Browse Catalog
            </Link>

            <Link
              href="/ai-valuator"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                isActive('/ai-valuator')
                  ? 'bg-orange-50 text-orange-600 border border-orange-200'
                  : 'text-slate-700 hover:text-orange-600 hover:bg-orange-50/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-orange-500 animate-pulse" />
              AI Valuator
              <span className="text-[10px] bg-orange-500 text-white font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                Free
              </span>
            </Link>

            <Link
              href="/browse?category=Commercial+Kitchen"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors hidden lg:inline-flex"
            >
              Kitchen & F&B
            </Link>

            <Link
              href="/browse?category=Office+Furniture"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors hidden lg:inline-flex"
            >
              Office Pods
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/listings/new"
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List an Asset</span>
            </Link>

            {status === 'authenticated' && session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-800 text-sm font-medium transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                  <span className="max-w-[120px] truncate font-semibold">
                    {session.user.businessName || session.user.name}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-1.5 z-50 text-sm">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="font-semibold text-slate-900 truncate">
                        {session.user.businessName || session.user.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                      {session.user.verified && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Verified GST Merchant
                        </span>
                      )}
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Seller & Buyer Dashboard
                    </Link>

                    <Link
                      href={`/profile/${session.user.id}`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      Public Business Profile
                    </Link>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        signOut({ callbackUrl: '/' });
                      }}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-rose-600 hover:bg-rose-50 font-medium text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  className="px-3 py-2 text-sm font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-300 transition-colors"
                >
                  Register Business
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/listings/new"
              className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg"
              title="List an Asset"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <Link
            href="/browse"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-slate-800 hover:bg-slate-50"
          >
            <Search className="w-4 h-4 text-slate-400" />
            Browse All Assets
          </Link>
          <Link
            href="/ai-valuator"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-orange-600 hover:bg-orange-50"
          >
            <Sparkles className="w-4 h-4" />
            AI Asset Valuator
          </Link>
          <Link
            href="/listings/new"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-white bg-orange-500"
          >
            <PlusCircle className="w-4 h-4" />
            List an Asset
          </Link>

          <div className="border-t border-slate-100 pt-3">
            {status === 'authenticated' && session?.user ? (
              <div className="space-y-1">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  href={`/profile/${session.user.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Building2 className="w-4 h-4" />
                  Business Profile
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-rose-600 hover:bg-rose-50 text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold border border-slate-300 rounded-lg text-slate-800"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2 text-sm font-semibold bg-slate-900 text-white rounded-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
