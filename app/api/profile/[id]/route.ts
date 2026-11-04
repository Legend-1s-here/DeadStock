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

    const user = await prisma.user.findUnique({
      where: { id },
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
        listings: {
          where: { status: 'ACTIVE' },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Business profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: user });
  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch business profile' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.id !== id) {
      return NextResponse.json({ error: 'Unauthorized to modify this profile' }, { status: 403 });
    }

    const body = await req.json();
    const { name, businessName, businessType, city, address, gstin, phone, bio } = body;

    const updated = await prisma.user.update({
      where: { id },
      data: {
        name,
        businessName,
        businessType,
        city,
        address,
        gstin: gstin ? gstin.toUpperCase().trim() : undefined,
        phone,
        bio,
        verified: Boolean(gstin && gstin.trim().length === 15),
      },
    });

    return NextResponse.json({ profile: updated });
  } catch (error) {
    console.error('Profile PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
