import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ListingDetailClient from './ListingDetailClient';

export const revalidate = 0;

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      seller: {
        select: {
          id: true,
          name: true,
          businessName: true,
          businessType: true,
          city: true,
          address: true,
          gstin: true,
          phone: true,
          bio: true,
          avatar: true,
          verified: true,
          rating: true,
          createdAt: true,
        },
      },
      offers: {
        select: {
          id: true,
          offeredPrice: true,
          quantity: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!listing) {
    notFound();
  }

  // Fetch similar listings in same category
  const similarListings = await prisma.listing.findMany({
    where: {
      category: listing.category,
      id: { not: listing.id },
      status: 'ACTIVE',
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <ListingDetailClient
      listing={listing}
      similarListings={similarListings}
    />
  );
}
