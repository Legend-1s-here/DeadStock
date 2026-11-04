'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  X,
  Tag,
  Truck,
  ShieldCheck,
  Send,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface MakeOfferModalProps {
  listing: {
    id: string;
    title: string;
    askingPrice: number;
    originalPrice: number;
    quantity: number;
    minLotSize: number;
    locationCity: string;
    seller: {
      businessName: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function MakeOfferModal({ listing, isOpen, onClose }: MakeOfferModalProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [quantity, setQuantity] = useState<number>(listing.minLotSize || 1);
  const [unitPrice, setUnitPrice] = useState<number>(Math.round(listing.askingPrice * 0.9)); // Default 10% below asking
  const [logisticsPref, setLogisticsPref] = useState<string>('Buyer Pickup');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const totalAmount = unitPrice * quantity;

  const applyDiscountPreset = (discountPercent: number) => {
    const discounted = Math.round(listing.askingPrice * (1 - discountPercent / 100));
    setUnitPrice(discounted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!session) {
      router.push('/auth/login');
      return;
    }

    if (unitPrice <= 0) {
      setError('Offered price must be greater than zero');
      return;
    }

    if (quantity < listing.minLotSize) {
      setError(`Minimum lot size for this asset is ${listing.minLotSize} units`);
      return;
    }

    if (quantity > listing.quantity) {
      setError(`Cannot request more than ${listing.quantity} available units`);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: listing.id,
          offeredPrice: unitPrice,
          quantity,
          logisticsPref,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit offer');
      }

      setSuccess(true);
      setTimeout(() => {
        onClose();
        router.push('/dashboard?tab=sent-offers');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'An error occurred while submitting your offer');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-orange-400" />
            <h3 className="font-bold text-base">Make a Direct Commercial Offer</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">Offer Submitted Successfully!</h4>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                Your proposal has been delivered to {listing.seller.businessName}. You can track negotiations in your dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Asset Brief */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-xs text-slate-500 font-medium">Target Commercial Asset</p>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{listing.title}</h4>
                <div className="flex items-center justify-between text-xs text-slate-600 mt-1">
                  <span>Seller: <strong>{listing.seller.businessName}</strong></span>
                  <span>Listed at: <strong className="text-slate-900">{formatINR(listing.askingPrice)}/unit</strong></span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Units Required (Available: {listing.quantity})
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={listing.minLotSize || 1}
                    max={listing.quantity}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="w-32 px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                  />
                  <span className="text-xs text-slate-500">
                    Min lot size: {listing.minLotSize || 1} units
                  </span>
                </div>
              </div>

              {/* Offer Unit Price */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Your Proposed Unit Price (₹)
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => applyDiscountPreset(10)}
                      className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 rounded-md transition-colors"
                    >
                      -10%
                    </button>
                    <button
                      type="button"
                      onClick={() => applyDiscountPreset(15)}
                      className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 rounded-md transition-colors"
                    >
                      -15%
                    </button>
                    <button
                      type="button"
                      onClick={() => applyDiscountPreset(20)}
                      className="px-2 py-0.5 text-[11px] font-bold bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-700 rounded-md transition-colors"
                    >
                      -20%
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                  <input
                    type="number"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                    placeholder="Enter unit offer amount"
                  />
                </div>
              </div>

              {/* Total Calculation Card */}
              <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-orange-800 font-medium block">Total Deal Proposal Value</span>
                  <span className="text-xs text-slate-500">
                    {quantity} units × {formatINR(unitPrice)}
                  </span>
                </div>
                <span className="text-xl font-black text-orange-600">
                  {formatINR(totalAmount)}
                </span>
              </div>

              {/* Logistics Preference */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-500" />
                  Logistics & Pickup Terms
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Buyer Pickup', label: 'Buyer Self-Pickup' },
                    { id: 'Seller Delivery', label: 'Seller Dispatch' },
                    { id: 'Partner Logistics', label: 'DeadStock Freight' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setLogisticsPref(option.id)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        logisticsPref === option.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposal Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Pickup Timeline Note
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Can arrange commercial tempo pick up by Friday morning. Can you confirm if all cables and manuals are included?"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-lg shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Submitting Offer...' : 'Send Commercial Offer'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
