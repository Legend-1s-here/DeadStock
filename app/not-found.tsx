import React from 'react';
import Link from 'next/link';
import { Package, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-3xl flex items-center justify-center mx-auto">
          <Package className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">404 - Asset Not Found</h1>
        <p className="text-xs text-slate-500 leading-relaxed">
          The commercial listing or page you are looking for may have been liquidated, relocated, or is no longer active.
        </p>
        <div className="pt-2">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Asset Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
