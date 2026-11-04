import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import EditListingForm from './EditListingForm';

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/listings/${id}/edit`);
  }

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  if (!listing) {
    notFound();
  }

  if (listing.sellerId !== session.user.id) {
    redirect(`/listings/${id}`);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Edit Commercial Asset Listing
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Update prices, available units, description, or mark this asset as Reserved/Sold.
        </p>
      </div>

      <EditListingForm listing={listing} />
    </div>
  );
}
