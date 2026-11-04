import React from 'react';
import Link from 'next/link';
import { Package, ShieldCheck, RefreshCw, Truck, FileText, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Trust & Guarantee Banner */}
      <div className="border-b border-slate-800 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">100% GST Verified</h4>
                <p className="text-xs text-slate-400">Only verified businesses and GSTIN merchants</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">Circular Economy</h4>
                <p className="text-xs text-slate-400">Preventing landfill waste & commercial scrap loss</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">Logistics Assistance</h4>
                <p className="text-xs text-slate-400">Verified intra-city freight & tempo booking</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-white text-sm font-semibold">Direct Counter-Offers</h4>
                <p className="text-xs text-slate-400">Fast 2-sided bulk deal negotiation engine</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                DEAD<span className="text-orange-500">STOCK</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s premier B2B circular marketplace for surplus commercial equipment, furniture, and inventory. We help closing businesses recover live capital and new ventures slash setup costs by up to 70%.
            </p>
            <div className="pt-2 text-xs text-slate-500">
              Operating across Mumbai • Delhi NCR • Bangalore • Pune • Hyderabad
            </div>
          </div>

          {/* Asset Categories */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Categories</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/browse?category=Commercial+Kitchen" className="hover:text-white transition-colors">
                  Commercial Kitchen & F&B
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Office+Furniture" className="hover:text-white transition-colors">
                  Office Furniture & Pods
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Retail+Fixtures" className="hover:text-white transition-colors">
                  Retail Displays & Counters
                </Link>
              </li>
              <li>
                <Link href="/browse?category=IT+%26+POS+Hardware" className="hover:text-white transition-colors">
                  IT, POS & Networking
                </Link>
              </li>
              <li>
                <Link href="/browse?category=Industrial+Equipment" className="hover:text-white transition-colors">
                  Warehouse & Pallet Jacks
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Platform Tools */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/browse" className="hover:text-white transition-colors">
                  Browse Catalog
                </Link>
              </li>
              <li>
                <Link href="/ai-valuator" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  AI Asset Valuator <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1 py-0.2 rounded-xs">Free</span>
                </Link>
              </li>
              <li>
                <Link href="/listings/new" className="hover:text-white transition-colors">
                  List Your Assets
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Merchant Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Demo Logins
                </Link>
              </li>
            </ul>
          </div>

          {/* Transparency & Impact */}
          <div>
            <h4 className="text-white text-sm font-bold tracking-wider uppercase mb-3">Impact & Trust</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-slate-300 font-medium">8-10% Commission</span>
                <p className="text-xs text-slate-500">Transparent success fee on completed sales</p>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Zero Scrap Dumping</span>
                <p className="text-xs text-slate-500">Every bulk asset given a productive second life</p>
              </li>
              <li className="pt-2">
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-1 text-xs text-orange-400 hover:text-orange-300 font-semibold"
                >
                  How B2B Handover Works <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DeadStock Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built for Wadhwani Foundation Venture Program</span>
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
