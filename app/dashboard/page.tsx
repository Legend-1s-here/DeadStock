import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import DashboardClient from './DashboardClient';

export const revalidate = 0;

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/auth/login?callbackUrl=/dashboard');
  }

  const userId = session.user.id;

  const [user, listings, receivedOffers, sentOffers, watchlist] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
    }),
    prisma.listing.findMany({
      where: { sellerId: userId },
      include: {
        _count: {
          select: { offers: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.offer.findMany({
      where: {
        listing: {
          sellerId: userId,
        },
      },
      include: {
        listing: true,
        buyer: true,
        messages: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.offer.findMany({
      where: {
        buyerId: userId,
      },
      include: {
        listing: {
          include: {
            seller: true,
          },
        },
        messages: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.watchlist.findMany({
      where: { userId },
      include: {
        listing: true,
      },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <DashboardClient
      user={user}
      listings={listings}
      receivedOffers={receivedOffers}
      sentOffers={sentOffers}
      watchlist={watchlist}
    />
  );
}
