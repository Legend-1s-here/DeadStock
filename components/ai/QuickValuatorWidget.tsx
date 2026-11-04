'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatINR, CATEGORIES, CONDITIONS } from '@/lib/utils';

export default function QuickValuatorWidget() {
  const [category, setCategory] = useState<string>('Commercial Kitchen');
  const [condition, setCondition] = useState<string>('Like New');
  const [originalPrice, setOriginalPrice] = useState<number>(85000);
  const [quantity, setQuantity] = useState<number>(1);
  const [ageYears, setAgeYears] = useState<number>(2);
  const [urgency, setUrgency] = useState<string>('normal');

  // Dynamic calculations
  let depreciationRate = 0.38 + (ageYears - 1) * 0.12;
  if (depreciationRate > 0.8) depreciationRate = 0.8;
  if (depreciationRate < 0.2) depreciationRate = 0.2;

  let conditionFactor = 1.0;
  if (condition === 'Brand New') {
    conditionFactor = 1.25;
    depreciationRate = 0.18;
  } else if (condition === 'Like New') {
    conditionFactor = 1.15;
  } else if (condition === 'Good') {
    conditionFactor = 0.95;
  } else if (condition === 'Liquidation / As-Is') {
    conditionFactor = 0.65;
    depreciationRate = 0.75;
  }

  const unitFairMarket = Math.max(
    Math.round(originalPrice * (1 - depreciationRate) * conditionFactor),
    Math.round(originalPrice * 0.15)
  );

  const unitScrapPrice = Math.round(originalPrice * 0.07);

  const totalDeadStock = unitFairMarket * quantity;
  const totalScrap = unitScrapPrice * quantity;
  const extraCapitalRecovered = totalDeadStock - totalScrap;
  const multiplier = totalScrap > 0 ? (totalDeadStock / totalScrap).toFixed(1) : '5.5';

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 text-orange-400 text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-4 h-4 animate-spin" />
            <span>Interactive AI Secondary Market Valuator</span>
          </div>

          <div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Estimate How Much Capital You Can Recover
            </h3>
            <p className="text-slate-400 text-sm mt-1.5 leading-relaxed">
              Don&apos;t let scrap brokers undervalue your commercial investments. See real-time B2B fair market liquidation pricing in seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Asset Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 text-white text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-hidden focus:border-orange-500"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Original Cost */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                <span>Original Purchase CapEx</span>
                <span className="text-orange-400">{formatINR(originalPrice)}</span>
              </div>
              <input
                type="range"
                min={5000}
                max={500000}
                step={5000}
                value={originalPrice}
                onChange={(e) => setOriginalPrice(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>₹5k</span>
                <span>₹2.5L</span>
                <span>₹5L+</span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                <span>Quantity / Bulk Units</span>
                <span className="text-orange-400">{quantity} units</span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>1 unit</span>
                <span>25 units</span>
                <span>50 units</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Comparison Card */}
        <div className="lg:col-span-5 bg-slate-950/80 rounded-2xl border border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">
              DeadStock Verified Recovery Estimate
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-orange-400">
                {formatINR(totalDeadStock)}
              </span>
              <span className="text-xs text-slate-400">
                ({formatINR(unitFairMarket)} / unit)
              </span>
            </div>
          </div>

          {/* Comparison vs Scrap Dealer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Local Scrap Dealer (Kabadiwala) offer:</span>
              <span className="text-rose-400 font-semibold line-through">
                {formatINR(totalScrap)}
              </span>
            </div>

            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-emerald-300">
                  Extra Capital Recovered:
                </span>
              </div>
              <span className="text-base font-black text-emerald-400">
                +{formatINR(extraCapitalRecovered)}
              </span>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-orange-400" />
              <span>
                You recover <strong>{multiplier}x more capital</strong> than scrap metal weight.
              </span>
            </div>
          </div>

          {/* CTA */}
          <div className="pt-2">
            <Link
              href={`/listings/new?category=${encodeURIComponent(category)}&condition=${encodeURIComponent(condition)}&askingPrice=${unitFairMarket}&originalPrice=${originalPrice}&quantity=${quantity}`}
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <span>List at this Estimated Price</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
