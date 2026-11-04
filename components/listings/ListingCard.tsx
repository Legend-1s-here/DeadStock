'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  ShieldCheck,
  Package,
  ArrowRight,
  Bookmark,
  Calendar,
} from 'lucide-react';
import { formatINR, calculateDiscount, CONDITIONS } from '@/lib/utils';
import MakeOfferModal from '../offers/MakeOfferModal';

interface ListingCardProps {
  listing: {
    id: string;
    title: string;
    category: string;
    condition: string;
    askingPrice: number;
    originalPrice: number;
    quantity: number;
    minLotSize: number;
    locationCity: string;
    images: string;
    featured?: boolean;
    pickupDeadline?: string | Date | null;
    seller: {
      id: string;
      businessName: string;
      city: string;
      verified: boolean;
      rating: number;
    };
  };
}

export default function ListingCard({ listing }: ListingCardProps) {
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Parse images JSON safely
  let imageUrl = 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80';
  try {
    const parsed = JSON.parse(listing.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      imageUrl = parsed[0];
    }
  } catch (e) {
    if (typeof listing.images === 'string' && listing.images.startsWith('http')) {
      imageUrl = listing.images;
    }
  }

  const discount = calculateDiscount(listing.askingPrice, listing.originalPrice);
  const conditionObj = CONDITIONS.find((c) => c.id === listing.condition) || {
    id: listing.condition,
    label: listing.condition,
    color: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const handleToggleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaving(true);
    try {
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
        {/* Image Container */}
        <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
          <Image
            src={imageUrl}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span
              className={`text-[11px] font-bold px-2.5 py-1 rounded-md border shadow-xs backdrop-blur-xs ${conditionObj.color}`}
            >
              {conditionObj.label}
            </span>
            {discount > 0 && (
              <span className="text-[11px] font-black px-2 py-1 rounded-md bg-orange-500 text-white shadow-xs">
                {discount}% OFF
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={handleToggleWatchlist}
            disabled={saving}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md shadow-xs transition-transform active:scale-90 z-10 ${
              isSaved
                ? 'bg-orange-500 text-white'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-orange-500'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save asset'}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>

          {/* Quantity & Lot Indicator */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-900/80 text-white backdrop-blur-xs">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-orange-400" />
              {listing.quantity} {listing.quantity > 1 ? 'Units' : 'Unit'} Available
            </span>
            {listing.minLotSize > 1 && (
              <span className="text-[11px] text-slate-300 font-normal">
                Min. Lot: {listing.minLotSize}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Category & City */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                {listing.category}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {listing.locationCity}
              </span>
            </div>

            {/* Title */}
            <Link href={`/listings/${listing.id}`} className="block group-hover:text-orange-600 transition-colors">
              <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">
                {listing.title}
              </h3>
            </Link>

            {/* Seller Info */}
            <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
              <span className="font-medium truncate max-w-[170px]">
                {listing.seller.businessName}
              </span>
              {listing.seller.verified && (
                <span title="Verified GST Merchant">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-xs text-slate-500 block -mb-0.5">Asking Price</span>
                <span className="text-xl font-black text-slate-900">
                  {formatINR(listing.askingPrice)}
                  <span className="text-xs font-normal text-slate-500 ml-1">/ unit</span>
                </span>
              </div>
              {listing.originalPrice > listing.askingPrice && (
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block -mb-0.5">Original CapEx</span>
                  <span className="text-xs line-through text-slate-400 font-medium">
                    {formatINR(listing.originalPrice)}
                  </span>
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOfferModalOpen(true)}
                className="w-full py-2 px-3 text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 transition-colors text-center"
              >
                Make an Offer
              </button>
              <Link
                href={`/listings/${listing.id}`}
                className="w-full py-2 px-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1"
              >
                <span>Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Offer Modal */}
      {offerModalOpen && (
        <MakeOfferModal
          listing={listing}
          isOpen={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
        />
      )}
    </>
  );
}
