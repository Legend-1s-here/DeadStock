import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const offer = await prisma.offer.findUnique({
      where: { id },
      include: {
        listing: true,
      },
    });

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    const isSeller = offer.listing.sellerId === session.user.id;
    const isBuyer = offer.buyerId === session.user.id;

    if (!isSeller && !isBuyer) {
      return NextResponse.json({ error: 'You are not authorized to respond to this offer' }, { status: 403 });
    }

    const body = await req.json();
    const { action, counterPrice, counterMessage, message } = body;

    let updatedOffer;

    if (action === 'ACCEPT') {
      updatedOffer = await prisma.offer.update({
        where: { id },
        data: { status: 'ACCEPTED' },
      });

      // Optionally mark listing as RESERVED
      await prisma.listing.update({
        where: { id: offer.listingId },
        data: { status: 'RESERVED' },
      }).catch(() => {});

      if (message) {
        await prisma.message.create({
          data: {
            offerId: id,
            senderId: session.user.id,
            content: `[Deal Accepted] ${message}`,
          },
        });
      }
    } else if (action === 'REJECT') {
      updatedOffer = await prisma.offer.update({
        where: { id },
        data: { status: 'REJECTED' },
      });

      if (message) {
        await prisma.message.create({
          data: {
            offerId: id,
            senderId: session.user.id,
            content: `[Offer Declined] ${message}`,
          },
        });
      }
    } else if (action === 'COUNTER') {
      if (!counterPrice) {
        return NextResponse.json({ error: 'Counter price is required' }, { status: 400 });
      }

      updatedOffer = await prisma.offer.update({
        where: { id },
        data: {
          status: 'COUNTERED',
          counterPrice: parseFloat(counterPrice),
          counterMessage: counterMessage || null,
        },
      });

      await prisma.message.create({
        data: {
          offerId: id,
          senderId: session.user.id,
          content: `[Counter Offer Proposed: ₹${counterPrice}/unit] ${counterMessage || ''}`,
        },
      });
    } else {
      return NextResponse.json({ error: 'Invalid action. Must be ACCEPT, REJECT, or COUNTER' }, { status: 400 });
    }

    return NextResponse.json({ offer: updatedOffer });
  } catch (error) {
    console.error('Offer action error:', error);
    return NextResponse.json({ error: 'Failed to update offer status' }, { status: 500 });
  }
}
