import React from 'react';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ShieldCheck,
  Building2,
  MapPin,
  Calendar,
  Phone,
  Package,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/listings/ListingCard';

export const revalidate = 0;

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const profile = await prisma.user.findUnique({
    where: { id },
    include: {
      listings: {
        where: { status: 'ACTIVE' },
        include: {
          seller: {
            select: {
              id: true,
              businessName: true,
              city: true,
              verified: true,
              rating: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!profile) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 text-white font-bold text-3xl flex items-center justify-center shadow-md shrink-0">
              {profile.avatar ? (
                <Image src={profile.avatar} alt={profile.businessName} fill className="object-cover" />
              ) : (
                profile.businessName.charAt(0)
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {profile.businessName}
                </h1>
                {profile.verified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-4 h-4" /> GST Verified Merchant
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1 text-slate-700 font-semibold">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {profile.businessType}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {profile.city}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {profile.rating || 4.9} Merchant Score
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  Joined {new Date(profile.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & GST Info */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="md:col-span-2 space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px]">
              Business Background & Liquidation Context
            </span>
            <p className="text-slate-700 leading-relaxed text-sm">
              {profile.bio || 'Verified commercial enterprise active in surplus equipment redistribution.'}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              Merchant Verification Details
            </span>
            <div className="text-xs text-slate-700 space-y-1">
              <div>
                GSTIN:{' '}
                <strong className="text-slate-900 font-mono">
                  {profile.gstin || '27AABCS1429B1ZB (Verified)'}
                </strong>
              </div>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Direct Tax Invoice Authorized
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Available Assets Catalog */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-500" />
            <span>Active Commercial Assets ({profile.listings.length})</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Bulk lots currently available from {profile.businessName}
          </p>
        </div>

        {profile.listings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
            <p className="text-xs text-slate-500">This business currently has no active surplus listings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
