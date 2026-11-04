import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.trim();
    const category = searchParams.get('category');
    const condition = searchParams.get('condition');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
    const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
    const sort = searchParams.get('sort') || 'newest';
    const featuredOnly = searchParams.get('featured') === 'true';
    const sellerId = searchParams.get('sellerId');

    const where: any = {};

    if (!sellerId) {
      where.status = 'ACTIVE';
    } else {
      where.sellerId = sellerId;
    }

    if (featuredOnly) {
      where.featured = true;
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (condition && condition !== 'All') {
      where.condition = condition;
    }

    if (city && city !== 'All') {
      where.locationCity = city;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.askingPrice = {};
      if (minPrice !== undefined) where.askingPrice.gte = minPrice;
      if (maxPrice !== undefined) where.askingPrice.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { brand: { contains: search } },
        { locationCity: { contains: search } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price-low') {
      orderBy = { askingPrice: 'asc' };
    } else if (sort === 'price-high') {
      orderBy = { askingPrice: 'desc' };
    } else if (sort === 'views') {
      orderBy = { views: 'desc' };
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            businessName: true,
            businessType: true,
            city: true,
            verified: true,
            rating: true,
            avatar: true,
          },
        },
        _count: {
          select: { offers: true },
        },
      },
    });

    return NextResponse.json({ listings });
  } catch (error) {
    console.error('Listings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to list an asset' }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      condition,
      askingPrice,
      originalPrice,
      quantity,
      minLotSize,
      locationCity,
      locationAddress,
      pincode,
      pickupDeadline,
      dimensions,
      weight,
      brand,
      modelYear,
      gstInvoice,
      images,
    } = body;

    if (!title || !description || !category || !condition || !askingPrice) {
      return NextResponse.json(
        { error: 'Title, description, category, condition, and asking price are required' },
        { status: 400 }
      );
    }

    const imagesArray = Array.isArray(images) && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80'];

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        category,
        condition,
        askingPrice: parseFloat(askingPrice),
        originalPrice: originalPrice ? parseFloat(originalPrice) : parseFloat(askingPrice) * 2.5,
        quantity: quantity ? parseInt(quantity) : 1,
        minLotSize: minLotSize ? parseInt(minLotSize) : 1,
        locationCity: locationCity || session.user.city || 'Mumbai',
        locationAddress: locationAddress || null,
        pincode: pincode || null,
        pickupDeadline: pickupDeadline ? new Date(pickupDeadline) : null,
        dimensions: dimensions || null,
        weight: weight || null,
        brand: brand || null,
        modelYear: modelYear || null,
        gstInvoice: gstInvoice !== undefined ? Boolean(gstInvoice) : true,
        images: JSON.stringify(imagesArray),
        sellerId: session.user.id,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json({ listing: newListing }, { status: 201 });
  } catch (error) {
    console.error('Listings POST error:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}
