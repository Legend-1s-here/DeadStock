import React from 'react';
import QuickValuatorWidget from '@/components/ai/QuickValuatorWidget';
import { Sparkles, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export default function AiValuatorPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multimodal Secondary Market Intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          AI Commercial Asset Valuator
        </h1>

        <p className="text-slate-600 text-sm leading-relaxed">
          Traditional scrap brokers take advantage of business owners facing lease deadlines by offering scrap metal rates. Our AI valuation engine benchmarks real secondary market transaction prices across India to tell you exactly what your equipment is worth.
        </p>
      </div>

      {/* Interactive Tool Widget */}
      <QuickValuatorWidget />

      {/* Explanatory Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold">
            1
          </div>
          <h3 className="font-bold text-slate-900 text-base">Commercial Depreciation Curves</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Unlike consumer electronics which lose 60% value immediately, heavy commercial stainless steel, branded espresso machines, and high-end ergonomic chairs retain 40-70% functional value for 5+ years.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            2
          </div>
          <h3 className="font-bold text-slate-900 text-base">Hyperlocal Demand Index</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our engine indexes regional demand across metro hubs (e.g. cloud kitchen expansion in Mumbai vs IT office downsizings in Bangalore) to optimize your recommended price for rapid 72-hour liquidation.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            3
          </div>
          <h3 className="font-bold text-slate-900 text-base">Scrap Dealer Protection</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We provide verified benchmark data so you have strong leverage during lease clearance negotiations and never let viable capital get dumped into scrap heaps.
          </p>
        </div>
      </div>
    </div>
  );
}
