'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  MapPin,
  ShieldCheck,
  Package,
  Calendar,
  Truck,
  FileText,
  Tag,
  Bookmark,
  Share2,
  CheckCircle2,
  AlertCircle,
  Building2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import { formatINR, calculateDiscount, CONDITIONS } from '@/lib/utils';
import MakeOfferModal from '@/components/offers/MakeOfferModal';

interface ListingDetailClientProps {
  listing: any;
  similarListings: any[];
}

export default function ListingDetailClient({
  listing,
  similarListings,
}: ListingDetailClientProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Parse images JSON safely
  let imagesList: string[] = [];
  try {
    const parsed = JSON.parse(listing.images);
    if (Array.isArray(parsed) && parsed.length > 0) {
      imagesList = parsed;
    }
  } catch (e) {
    if (typeof listing.images === 'string' && listing.images.startsWith('http')) {
      imagesList = [listing.images];
    }
  }

  if (imagesList.length === 0) {
    imagesList = ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'];
  }

  const discount = calculateDiscount(listing.askingPrice, listing.originalPrice);
  const conditionObj = CONDITIONS.find((c) => c.id === listing.condition) || {
    id: listing.condition,
    label: listing.condition,
    color: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const isOwner = session?.user?.id === listing.sellerId;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing.title,
        text: `Check out this commercial asset on DeadStock: ${listing.title}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleToggleWatchlist = async () => {
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
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-900">Home</Link>
        <span>/</span>
        <Link href="/browse" className="hover:text-slate-900">Catalog</Link>
        <span>/</span>
        <Link href={`/browse?category=${encodeURIComponent(listing.category)}`} className="hover:text-slate-900">
          {listing.category}
        </Link>
        <span>/</span>
        <span className="text-slate-900 font-semibold truncate max-w-xs">{listing.title}</span>
      </nav>

      {/* Main Grid: Images (Left) + Details & Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/3 w-full bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-md">
            <Image
              src={imagesList[selectedImageIndex]}
              alt={listing.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />

            {/* Badges on image */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-md border shadow-xs backdrop-blur-xs ${conditionObj.color}`}>
                {conditionObj.label}
              </span>
              {discount > 0 && (
                <span className="text-xs font-black px-2.5 py-1 rounded-md bg-orange-500 text-white shadow-xs">
                  {discount}% BELOW NEW CAPEX
                </span>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md backdrop-blur-xs transition-colors"
                title="Share asset"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleToggleWatchlist}
                className={`p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors ${
                  isSaved
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/90 hover:bg-white text-slate-700 hover:text-orange-500'
                }`}
                title="Save asset"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>

            {copiedLink && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-full shadow-lg">
                Link copied to clipboard!
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {imagesList.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {imagesList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === idx ? 'border-orange-500 shadow-md scale-95' : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`Thumbnail ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Commercial Description */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              Asset Overview & Condition Notes
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>

            {listing.pickupDeadline && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-900 text-xs">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Pickup Deadline:</strong> Property lease vacating on{' '}
                  {new Date(listing.pickupDeadline).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}. Early bulk pickup preferred.
                </span>
              </div>
            )}
          </div>

          {/* Detailed Specifications Table */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider text-xs">
              Technical Specifications & Commercial Terms
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Manufacturer / Brand</span>
                <span className="font-bold text-slate-900 text-sm">{listing.brand || 'Commercial Grade'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Purchase / Model Year</span>
                <span className="font-bold text-slate-900 text-sm">{listing.modelYear || '2022 - 2023'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Dimensions (W x D x H)</span>
                <span className="font-bold text-slate-900 text-sm">{listing.dimensions || 'Standard Commercial'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Estimated Net Weight</span>
                <span className="font-bold text-slate-900 text-sm">{listing.weight || 'Standard Freight'}</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">GST Tax Invoice</span>
                <span className="font-bold text-emerald-600 text-sm flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Available with HSN billing
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block font-medium">Escrow & Inspection</span>
                <span className="font-bold text-slate-900 text-sm">Physical Inspection on Pickup</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Negotiation Actions */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
          {/* Main Pricing Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xl space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span className="uppercase tracking-wider font-bold text-orange-600">
                  {listing.category}
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {listing.locationCity}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
                {listing.title}
              </h1>
            </div>

            {/* Price Callout */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-500 block">Asking Unit Price</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900">
                      {formatINR(listing.askingPrice)}
                    </span>
                    <span className="text-xs text-slate-500">/ unit</span>
                  </div>
                </div>

                {listing.originalPrice > listing.askingPrice && (
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Original CapEx</span>
                    <span className="text-sm line-through text-slate-400 font-semibold">
                      {formatINR(listing.originalPrice)}
                    </span>
                  </div>
                )}
              </div>

              {discount > 0 && (
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pt-1 border-t border-slate-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    You save <strong>{formatINR(listing.originalPrice - listing.askingPrice)}</strong> per unit ({discount}% savings)
                  </span>
                </div>
              )}
            </div>

            {/* Inventory & Lot Size */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-orange-50/60 border border-orange-100 rounded-xl">
                <span className="text-slate-500 block">Total In Stock</span>
                <span className="text-base font-black text-slate-900">
                  {listing.quantity} {listing.quantity > 1 ? 'Units' : 'Unit'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block">Minimum Lot Size</span>
                <span className="text-base font-bold text-slate-900">
                  {listing.minLotSize} {listing.minLotSize > 1 ? 'Units' : 'Unit'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              {isOwner ? (
                <div className="space-y-2">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs text-center font-medium">
                    You are the seller of this commercial asset.
                  </div>
                  <Link
                    href={`/listings/${listing.id}/edit`}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
                  >
                    Edit Listing Details
                  </Link>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setOfferModalOpen(true)}
                    className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Tag className="w-4 h-4" />
                    <span>Make a Direct B2B Offer</span>
                  </button>

                  <button
                    onClick={() => setOfferModalOpen(true)}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Reserve & Request Inspection</span>
                  </button>
                </>
              )}
            </div>

            {/* Logistics & Protection guarantees */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-slate-400" />
                <span>Assisted commercial tempo transport available</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Escrow release only after physical asset handover</span>
              </div>
            </div>
          </div>

          {/* Seller Profile Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Verified Seller
                </span>
                <h4 className="font-bold text-base text-slate-900 mt-0.5">
                  {listing.seller.businessName}
                </h4>
                <p className="text-xs text-slate-500">{listing.seller.businessType} • {listing.seller.city}</p>
              </div>

              {listing.seller.verified && (
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl" title="Verified GST Merchant">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              )}
            </div>

            {listing.seller.bio && (
              <p className="text-xs text-slate-600 leading-relaxed italic">
                &ldquo;{listing.seller.bio}&rdquo;
              </p>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Merchant Rating: <strong className="text-slate-900">★ {listing.seller.rating || 4.9}</strong></span>
              <Link
                href={`/profile/${listing.seller.id}`}
                className="font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>View Store Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Listings Carousel */}
      {similarListings.length > 0 && (
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="mb-6">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Similar Commercial Assets
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Other surplus inventory listed in {listing.category}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {similarListings.map((item) => (
              <div key={item.id}>
                {/* Re-use card */}
                <Link
                  href={`/listings/${item.id}`}
                  className="group block bg-white rounded-2xl border border-slate-200 hover:shadow-xl transition-all overflow-hidden p-4 space-y-3"
                >
                  <div className="relative aspect-16/9 w-full bg-slate-100 rounded-xl overflow-hidden">
                    <Image
                      src={
                        item.images.startsWith('[')
                          ? JSON.parse(item.images)[0]
                          : item.images
                      }
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      {item.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-orange-600">
                      {item.title}
                    </h4>
                    <span className="text-sm font-black text-slate-900 mt-1 block">
                      {formatINR(item.askingPrice)} / unit
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Make Offer Modal */}
      {offerModalOpen && (
        <MakeOfferModal
          listing={listing}
          isOpen={offerModalOpen}
          onClose={() => setOfferModalOpen(false)}
        />
      )}
    </div>
  );
}
