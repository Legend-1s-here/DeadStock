import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Offers where the logged in user is the SELLER (received offers)
    const receivedOffers = await prisma.offer.findMany({
      where: {
        listing: {
          sellerId: userId,
        },
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            askingPrice: true,
            originalPrice: true,
            images: true,
            status: true,
            category: true,
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            businessName: true,
            businessType: true,
            city: true,
            verified: true,
            rating: true,
            avatar: true,
            phone: true,
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Offers where the logged in user is the BUYER (sent offers)
    const sentOffers = await prisma.offer.findMany({
      where: {
        buyerId: userId,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            askingPrice: true,
            originalPrice: true,
            images: true,
            status: true,
            category: true,
            seller: {
              select: {
                id: true,
                name: true,
                businessName: true,
                businessType: true,
                city: true,
                verified: true,
                rating: true,
                phone: true,
              },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ receivedOffers, sentOffers });
  } catch (error) {
    console.error('Offers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Please log in to submit an offer' }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, offeredPrice, quantity, logisticsPref, message } = body;

    if (!listingId || !offeredPrice) {
      return NextResponse.json({ error: 'Listing ID and offered price are required' }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.sellerId === session.user.id) {
      return NextResponse.json({ error: 'You cannot submit an offer on your own listing' }, { status: 400 });
    }

    const parsedPrice = parseFloat(offeredPrice);
    const parsedQty = quantity ? parseInt(quantity) : 1;
    const totalAmount = parsedPrice * parsedQty;

    const offer = await prisma.offer.create({
      data: {
        listingId,
        buyerId: session.user.id,
        offeredPrice: parsedPrice,
        quantity: parsedQty,
        totalAmount,
        logisticsPref: logisticsPref || 'Buyer Pickup',
        message: message || null,
        status: 'PENDING',
      },
    });

    if (message && message.trim()) {
      await prisma.message.create({
        data: {
          offerId: offer.id,
          senderId: session.user.id,
          content: message.trim(),
        },
      });
    }

    return NextResponse.json({ offer }, { status: 201 });
  } catch (error) {
    console.error('Offers POST error:', error);
    return NextResponse.json({ error: 'Failed to submit offer' }, { status: 500 });
  }
}
