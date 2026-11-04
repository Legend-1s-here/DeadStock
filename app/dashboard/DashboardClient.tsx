'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package,
  Tag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  MessageSquare,
  PlusCircle,
  Eye,
  Edit,
  Clock,
  Building2,
  TrendingUp,
  Coins,
  Send,
  X,
  Bookmark,
} from 'lucide-react';
import { formatINR, formatCompactINR } from '@/lib/utils';

interface DashboardClientProps {
  user: any;
  listings: any[];
  receivedOffers: any[];
  sentOffers: any[];
  watchlist: any[];
}

export default function DashboardClient({
  user,
  listings,
  receivedOffers,
  sentOffers,
  watchlist,
}: DashboardClientProps) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'listings' | 'received-offers' | 'sent-offers' | 'watchlist'>('listings');
  const [selectedOfferForChat, setSelectedOfferForChat] = useState<any | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Counter offer state
  const [counterModalOpen, setCounterModalOpen] = useState(false);
  const [targetOffer, setTargetOffer] = useState<any | null>(null);
  const [counterPrice, setCounterPrice] = useState('');
  const [counterNote, setCounterNote] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Calculate stats
  const totalValueListed = listings.reduce(
    (acc, curr) => acc + curr.askingPrice * curr.quantity,
    0
  );
  const pendingOffersCount = receivedOffers.filter((o) => o.status === 'PENDING').length;
  const acceptedDealsCount = receivedOffers.filter((o) => o.status === 'ACCEPTED').length;

  const handleOfferAction = async (offerId: string, action: 'ACCEPT' | 'REJECT') => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendCounter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetOffer || !counterPrice) return;
    setActionLoading(true);

    try {
      const res = await fetch(`/api/offers/${targetOffer.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'COUNTER',
          counterPrice: parseFloat(counterPrice),
          counterMessage: counterNote,
        }),
      });
      if (res.ok) {
        setCounterModalOpen(false);
        setTargetOffer(null);
        setCounterPrice('');
        setCounterNote('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOfferForChat || !chatMessage.trim()) return;
    setChatLoading(true);

    try {
      const res = await fetch(`/api/offers/${selectedOfferForChat.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: chatMessage }),
      });
      if (res.ok) {
        setChatMessage('');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {user.businessName?.charAt(0) || user.name?.charAt(0) || 'D'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                {user.businessName}
              </h1>
              {user.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> GST Verified
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Contact: {user.name} • {user.city} • {user.businessType}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/profile/${user.id}`}
            className="px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Public Storefront
          </Link>
          <Link
            href="/listings/new"
            className="px-5 py-2.5 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 active:scale-95 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>List an Asset</span>
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Active Listings
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
            {listings.length}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Assets in circulation</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Commercial CapEx Value
          </span>
          <span className="text-2xl sm:text-3xl font-black text-orange-500 mt-1 block">
            {formatCompactINR(totalValueListed)}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Total asset asking volume</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Incoming Proposals
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 mt-1 block">
            {receivedOffers.length}
          </span>
          <span className="text-[11px] text-blue-600 font-semibold mt-1 block">
            {pendingOffersCount} pending review
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Deals Accepted
          </span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-600 mt-1 block">
            {acceptedDealsCount}
          </span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
            Capital recovered cleanly
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-slate-200 flex gap-4 overflow-x-auto text-sm font-bold">
        <button
          onClick={() => setActiveTab('listings')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'listings'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Listings ({listings.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('received-offers')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'received-offers'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Tag className="w-4 h-4" />
          <span>Received Offers ({receivedOffers.length})</span>
          {pendingOffersCount > 0 && (
            <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-black">
              {pendingOffersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('sent-offers')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'sent-offers'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Sent Offers ({sentOffers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('watchlist')}
          className={`pb-3 px-1 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'watchlist'
              ? 'border-orange-500 text-orange-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Watchlist ({watchlist.length})</span>
        </button>
      </div>

      {/* TAB 1: MY LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          {listings.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                      <Image
                        src={
                          item.images.startsWith('[')
                            ? JSON.parse(item.images)[0]
                            : item.images
                        }
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-sm">
                          {item.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-sm ${
                            item.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm mt-1">{item.title}</h3>
                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                        <span>Asking: <strong className="text-slate-900">{formatINR(item.askingPrice)}</strong>/unit</span>
                        <span>Stock: <strong>{item.quantity} units</strong></span>
                        <span>Views: <strong>{item.views}</strong></span>
                        <span>Offers: <strong>{item._count?.offers || 0}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href={`/listings/${item.id}`}
                      className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>
                    <Link
                      href={`/listings/${item.id}/edit`}
                      className="px-3.5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-4">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-800">No assets listed yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Ready to recover capital on unused equipment? List your first commercial lot in 2 minutes.
              </p>
              <Link
                href="/listings/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl"
              >
                <PlusCircle className="w-4 h-4" />
                <span>List an Asset Now</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RECEIVED OFFERS (AS SELLER) */}
      {activeTab === 'received-offers' && (
        <div className="space-y-4">
          {receivedOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {receivedOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Offer Received For</span>
                      <h4 className="font-bold text-sm text-slate-900">{offer.listing.title}</h4>
                    </div>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-md self-start sm:self-auto ${
                        offer.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.status === 'COUNTERED'
                          ? 'bg-blue-100 text-blue-800'
                          : offer.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block font-medium">Buyer Entity</span>
                      <span className="font-bold text-slate-900">{offer.buyer.businessName}</span>
                      <span className="text-slate-500 block text-[11px]">{offer.buyer.city} • {offer.buyer.phone || 'Phone on deal confirmation'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Proposed Deal Terms</span>
                      <span className="font-bold text-orange-600 text-sm">
                        {formatINR(offer.offeredPrice)}/unit × {offer.quantity} units
                      </span>
                      <span className="text-slate-500 block font-medium">
                        Total Value: <strong>{formatINR(offer.totalAmount)}</strong>
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block font-medium">Logistics Preference</span>
                      <span className="font-semibold text-slate-800">{offer.logisticsPref}</span>
                    </div>
                  </div>

                  {offer.message && (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 italic border border-slate-100">
                      &ldquo;{offer.message}&rdquo;
                    </div>
                  )}

                  {offer.counterPrice && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-medium">
                      <strong>Your Proposed Counter:</strong> {formatINR(offer.counterPrice)}/unit • {offer.counterMessage}
                    </div>
                  )}

                  {/* Actions Bar */}
                  {offer.status === 'PENDING' && (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleOfferAction(offer.id, 'REJECT')}
                        disabled={actionLoading}
                        className="px-3.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => {
                          setTargetOffer(offer);
                          setCounterPrice(String(Math.round(offer.listing.askingPrice * 0.95)));
                          setCounterModalOpen(true);
                        }}
                        disabled={actionLoading}
                        className="px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200"
                      >
                        Propose Counter-Offer
                      </button>
                      <button
                        onClick={() => handleOfferAction(offer.id, 'ACCEPT')}
                        disabled={actionLoading}
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                      >
                        Accept Deal ({formatINR(offer.totalAmount)})
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">No offers received yet. Bids will appear here when commercial buyers propose deals.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: SENT OFFERS (AS BUYER) */}
      {activeTab === 'sent-offers' && (
        <div className="space-y-4">
          {sentOffers.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {sentOffers.map((offer) => (
                <div key={offer.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400">Offer Placed On</span>
                      <h4 className="font-bold text-sm text-slate-900">{offer.listing.title}</h4>
                      <p className="text-xs text-slate-500">Seller: {offer.listing.seller.businessName}</p>
                    </div>
                    <span
                      className={`text-xs font-black px-2.5 py-1 rounded-md ${
                        offer.status === 'ACCEPTED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : offer.status === 'COUNTERED'
                          ? 'bg-blue-100 text-blue-800'
                          : offer.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {offer.status}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 flex items-center gap-4">
                    <span>Offered: <strong>{formatINR(offer.offeredPrice)}/unit</strong></span>
                    <span>Units: <strong>{offer.quantity}</strong></span>
                    <span>Total Deal: <strong className="text-slate-900">{formatINR(offer.totalAmount)}</strong></span>
                  </div>

                  {offer.counterPrice && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                      <strong>Seller Counter-Offer:</strong> {formatINR(offer.counterPrice)}/unit. &ldquo;{offer.counterMessage}&rdquo;
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <Link
                      href={`/listings/${offer.listing.id}`}
                      className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                    >
                      View Asset
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">You have not submitted any purchase offers yet. Browse the catalog to find equipment.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WATCHLIST */}
      {activeTab === 'watchlist' && (
        <div className="space-y-4">
          {watchlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {watchlist.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                  <div className="relative aspect-16/9 w-full bg-slate-100 rounded-xl overflow-hidden">
                    <Image
                      src={
                        item.listing.images.startsWith('[')
                          ? JSON.parse(item.listing.images)[0]
                          : item.listing.images
                      }
                      alt={item.listing.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">
                      {item.listing.category}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 line-clamp-1">
                      {item.listing.title}
                    </h4>
                    <span className="text-sm font-black text-slate-900 mt-1 block">
                      {formatINR(item.listing.askingPrice)}/unit
                    </span>
                  </div>
                  <Link
                    href={`/listings/${item.listing.id}`}
                    className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                  >
                    <span>View Asset</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <p className="text-xs text-slate-500">Your watchlist is empty. Click the bookmark icon on any asset to save it.</p>
            </div>
          )}
        </div>
      )}

      {/* COUNTER OFFER MODAL */}
      {counterModalOpen && targetOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-2 border-b">
              <h3 className="font-bold text-slate-900 text-base">Propose Counter-Offer</h3>
              <button onClick={() => setCounterModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSendCounter} className="space-y-4 text-xs">
              <div>
                <span className="text-slate-500 block">Buyer offered:</span>
                <span className="text-sm font-bold text-slate-900">
                  {formatINR(targetOffer.offeredPrice)}/unit for {targetOffer.quantity} units
                </span>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Your Counter Price Per Unit (₹)
                </label>
                <input
                  type="number"
                  required
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Note to Buyer (Pickup window, logistics condition)
                </label>
                <textarea
                  rows={3}
                  value={counterNote}
                  onChange={(e) => setCounterNote(e.target.value)}
                  placeholder="e.g. Can accept ₹1,350 if picked up by this Saturday morning."
                  className="w-full p-2.5 border rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCounterModalOpen(false)}
                  className="px-4 py-2 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl"
                >
                  {actionLoading ? 'Sending...' : 'Send Counter Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
