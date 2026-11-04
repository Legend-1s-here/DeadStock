import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
            verified: true,
            rating: true,
            avatar: true,
            createdAt: true,
            _count: {
              select: { listings: true },
            },
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
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // Increment views asynchronously
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    }).catch(() => {});

    return NextResponse.json({ listing });
  } catch (error) {
    console.error('Listing detail error:', error);
    return NextResponse.json({ error: 'Failed to fetch listing' }, { status: 500 });
  }
}

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

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'Only the seller can update this listing' }, { status: 403 });
    }

    const body = await req.json();
    const updated = await prisma.listing.update({
      where: { id },
      data: {
        ...body,
        askingPrice: body.askingPrice ? parseFloat(body.askingPrice) : undefined,
        originalPrice: body.originalPrice ? parseFloat(body.originalPrice) : undefined,
        quantity: body.quantity ? parseInt(body.quantity) : undefined,
        minLotSize: body.minLotSize ? parseInt(body.minLotSize) : undefined,
        images: body.images ? (Array.isArray(body.images) ? JSON.stringify(body.images) : body.images) : undefined,
      },
    });

    return NextResponse.json({ listing: updated });
  } catch (error) {
    console.error('Listing PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    if (listing.sellerId !== session.user.id) {
      return NextResponse.json({ error: 'Only the seller can delete this listing' }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Listing DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
  }
}
