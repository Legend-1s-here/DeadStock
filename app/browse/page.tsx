import React, { Suspense } from 'react';
import { prisma } from '@/lib/prisma';
import BrowseClient from './BrowseClient';

export const revalidate = 0;

export default async function BrowsePage() {
  const listings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
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
  });

  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <BrowseClient initialListings={listings} />
    </Suspense>
  );
}
