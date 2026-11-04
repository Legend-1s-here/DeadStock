'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Package,
  Sparkles,
  Upload,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Clock,
  Coins,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import {
  CATEGORIES,
  CONDITIONS,
  CITIES,
  SAMPLE_ASSET_IMAGES,
  formatINR,
} from '@/lib/utils';

export default function NewListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Redirect if not signed in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/listings/new');
    }
  }, [status, router]);

  // Form State initialized optionally from URL params
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || 'Commercial Kitchen');
  const [condition, setCondition] = useState(searchParams.get('condition') || 'Like New');
  const [askingPrice, setAskingPrice] = useState(searchParams.get('askingPrice') || '');
  const [originalPrice, setOriginalPrice] = useState(searchParams.get('originalPrice') || '');
  const [quantity, setQuantity] = useState(searchParams.get('quantity') || '1');
  const [minLotSize, setMinLotSize] = useState('1');
  const [locationCity, setLocationCity] = useState(session?.user?.city || 'Mumbai');
  const [locationAddress, setLocationAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [pickupDeadline, setPickupDeadline] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [brand, setBrand] = useState('');
  const [modelYear, setModelYear] = useState('2023');
  const [gstInvoice, setGstInvoice] = useState(true);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'
  );

  // AI Assistant State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuccess, setAiSuccess] = useState(false);

  // Submission State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI Auto-Fill Handler
  const handleAiAutoFill = async () => {
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    setAiSuccess(false);

    try {
      const res = await fetch('/api/ai-valuator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: aiPrompt,
          category,
          condition,
          originalPrice: originalPrice ? parseFloat(originalPrice) : 35000,
          quantity: parseInt(quantity) || 1,
        }),
      });

      const data = await res.json();
      if (res.ok && data.recommendedListing) {
        setTitle(data.recommendedListing.title);
        setDescription(data.recommendedListing.description);
        if (!askingPrice) {
          setAskingPrice(String(data.valuation.fairMarketUnitPrice));
        }
        if (!originalPrice) {
          setOriginalPrice(String(data.recommendedListing.originalPrice));
        }
        if (data.valuation.suggestedMinLotSize) {
          setMinLotSize(String(data.valuation.suggestedMinLotSize));
        }
        setAiSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !askingPrice) {
      setError('Title, description, and asking price are required');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          category,
          condition,
          askingPrice,
          originalPrice: originalPrice || String(parseFloat(askingPrice) * 2),
          quantity,
          minLotSize,
          locationCity,
          locationAddress,
          pincode,
          pickupDeadline: pickupDeadline || null,
          dimensions,
          weight,
          brand,
          modelYear,
          gstInvoice,
          images: [imageUrl],
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      router.push(`/listings/${data.listing.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          List Surplus Commercial Assets
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Turn your unused equipment, furniture, and inventory into working capital before your lease expires.
        </p>
      </div>

      {/* AI ASSISTANT PROMPT BAR */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl mb-8 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-200" />
          <h3 className="font-bold text-base">Gemini AI Auto-Listing Assistant</h3>
        </div>
        <p className="text-xs text-orange-100 max-w-xl">
          Don&apos;t have time to write commercial specifications? Just type a raw summary (e.g., &ldquo;40 teak restaurant chairs bought in 2023 for 4000 each in Bandra&rdquo;) and let AI estimate fair prices and generate the complete listing.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Type raw asset description here..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/20 text-white placeholder-orange-200 text-sm border border-white/30 focus:outline-hidden focus:bg-white/30"
          />
          <button
            type="button"
            onClick={handleAiAutoFill}
            disabled={aiLoading || !aiPrompt.trim()}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-orange-400" />
            <span>{aiLoading ? 'Analyzing Asset...' : 'AI Auto-Fill Form'}</span>
          </button>
        </div>

        {aiSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-amber-100 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Form successfully auto-filled! Review and adjust values below.</span>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* MAIN LISTING FORM */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        {/* Step 1: Basic Info */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Package className="w-4 h-4 text-orange-500" />
            1. Asset Classification & Title
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Commercial Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Physical Condition *
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900"
              >
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Asset Listing Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 40x Solid Teak Restaurant Dining Chairs with Premium Cushioning"
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Manufacturer / Brand
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Steelcase, Western, Featherlite, Custom"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Purchase / Model Year
              </label>
              <input
                type="text"
                value={modelYear}
                onChange={(e) => setModelYear(e.target.value)}
                placeholder="e.g. 2022 or 2023"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Commercial Pricing & Inventory Quantities */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Coins className="w-4 h-4 text-orange-500" />
            2. Commercial Pricing & Inventory Quantities
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Asking Price Per Unit (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  required
                  value={askingPrice}
                  onChange={(e) => setAskingPrice(e.target.value)}
                  placeholder="e.g. 1450"
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Original CapEx / Purchase Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="e.g. 4500 (used to display buyer discount)"
                  className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Total Available Units
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Minimum Lot Size (for bulk orders)
              </label>
              <input
                type="number"
                min={1}
                value={minLotSize}
                onChange={(e) => setMinLotSize(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="gstInvoice"
              checked={gstInvoice}
              onChange={(e) => setGstInvoice(e.target.checked)}
              className="w-4 h-4 accent-orange-500 rounded-sm"
            />
            <label htmlFor="gstInvoice" className="text-xs text-slate-700 font-semibold cursor-pointer">
              Official GST Tax Invoice will be provided upon sale handover
            </label>
          </div>
        </div>

        {/* Step 3: Location & Handover Deadlines */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            3. Location & Handover Deadlines
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Metro City Hub *
              </label>
              <select
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Commercial Lease Expiry / Pickup Deadline
              </label>
              <input
                type="date"
                value={pickupDeadline}
                onChange={(e) => setPickupDeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Pickup Address / Area
            </label>
            <input
              type="text"
              value={locationAddress}
              onChange={(e) => setLocationAddress(e.target.value)}
              placeholder="e.g. Linking Road, Bandra West, Mumbai"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Dimensions (W x D x H)
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="e.g. 45cm x 50cm x 85cm"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Approximate Weight
              </label>
              <input
                type="text"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 7 kg per unit"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Asset Description & Photo */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b pb-2 flex items-center gap-2">
            <Upload className="w-4 h-4 text-orange-500" />
            4. Asset Description & Commercial Photo
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Detailed Description & Condition Notes *
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe operating history, reason for sale, maintenance care, and handover terms..."
              className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Asset Image URL (Unsplash or direct image link)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
            />
          </div>

          {/* Quick Preset Image Chooser */}
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase block mb-2">
              Or pick a sample commercial equipment photo:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_ASSET_IMAGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setImageUrl(preset.url)}
                  className={`p-2 rounded-xl border text-left text-[11px] transition-all flex flex-col justify-between h-20 ${
                    imageUrl === preset.url
                      ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="line-clamp-2">{preset.name}</span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400">
                    {preset.category}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Package className="w-4 h-4" />
            <span>{loading ? 'Publishing Asset...' : 'Publish Commercial Listing'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
