const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting DeadStock Database Seeding...');

  // Clean existing data
  await prisma.message.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.watchlist.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create Verified Business Users
  const rajesh = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar',
      email: 'spice.garden@demo.com',
      password: hashedPassword,
      businessName: 'Spice Garden Restaurant & Cafe',
      businessType: 'F&B / Restaurant / Cafe',
      city: 'Mumbai',
      address: 'Shop 4, Linking Road, Bandra West, Mumbai 400050',
      gstin: '27AABCS1429B1ZB',
      phone: '+91 98201 44521',
      bio: 'Owner of Spice Garden (operating since 2018). Downsizing dining hall to transition into an agile cloud kitchen model.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      verified: true,
      rating: 4.9,
    },
  });

  const neha = await prisma.user.create({
    data: {
      name: 'Neha Sharma',
      email: 'trendz.store@demo.com',
      password: hashedPassword,
      businessName: 'Trendz Boutique & Lifestyle Retail',
      businessType: 'Retail Store / Boutique',
      city: 'Delhi NCR',
      address: 'M-Block Market, Greater Kailash 1, New Delhi 110048',
      gstin: '07AABCT5581F1Z4',
      phone: '+91 98110 33492',
      bio: 'Premium apparel retailer renovating 2 boutique stores in South Delhi. Seeking quality display units and POS setups.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      verified: true,
      rating: 4.8,
    },
  });

  const vikram = await prisma.user.create({
    data: {
      name: 'Vikram Mehta',
      email: 'techbridge@demo.com',
      password: hashedPassword,
      businessName: 'TechBridge Solutions & Coworks',
      businessType: 'IT / SaaS / Office',
      city: 'Bangalore',
      address: 'Tower B, 4th Floor, HSR Layout Sector 2, Bangalore 560102',
      gstin: '29AABCU9012D1Z9',
      phone: '+91 99002 88410',
      bio: 'IT workspace facility lead. Consolidating Bangalore office space following hybrid work schedule implementation.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      verified: true,
      rating: 5.0,
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: 'Priya Shrivastava',
      email: 'priya@deadstock.in',
      password: hashedPassword,
      businessName: 'DeadStock Capital Recovery Partner',
      businessType: 'Logistics / Warehouse',
      city: 'Mumbai',
      address: 'Andheri East Industrial Estate, Mumbai 400069',
      gstin: '27AADCD9921E1Z0',
      phone: '+91 98333 11223',
      bio: 'Verified DeadStock liquidation specialist & certified commercial asset inspector.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      verified: true,
      rating: 5.0,
    },
  });

  console.log('✅ Created 4 Verified Business Accounts');

  // 2. Create Commercial Asset Listings
  const l1 = await prisma.listing.create({
    data: {
      title: '40x Solid Teak Restaurant Dining Chairs with Premium Cushioning',
      description: 'Complete lot of 40 custom solid teak wood dining chairs from high-end Bandra cafe. Reinforced mortise-and-tenon joints, stain-resistant dark charcoal fabric cushion. Used for 18 months, zero structural defects. Perfect for new restaurant, brewery, or bistro looking to avoid ₹4,500/chair new CapEx. Lease expires Nov 30.',
      category: 'Commercial Kitchen',
      condition: 'Like New',
      askingPrice: 1450,
      originalPrice: 4500,
      quantity: 40,
      minLotSize: 10,
      locationCity: 'Mumbai',
      locationAddress: 'Linking Road, Bandra West',
      pincode: '400050',
      pickupDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      dimensions: '45cm W x 50cm D x 85cm H',
      weight: '6.5 kg per chair',
      brand: 'Custom Solid Wood Fabricators',
      modelYear: '2023',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 342,
      featured: true,
      sellerId: rajesh.id,
    },
  });

  const l2 = await prisma.listing.create({
    data: {
      title: 'Commercial 4-Door Upright Stainless Steel Chiller (Western 1200L)',
      description: 'Heavy duty Western 1200L upright commercial refrigerator. Dual digital temperature display, auto-defrost, copper cooling coils, heavy duty castor wheels with brakes. Maintained under quarterly AMC, running flawlessly at 2°C to 8°C. Ideal for central production kitchens, cloud kitchens, or bakeries.',
      category: 'Commercial Kitchen',
      condition: 'Good',
      askingPrice: 48000,
      originalPrice: 125000,
      quantity: 1,
      minLotSize: 1,
      locationCity: 'Mumbai',
      locationAddress: 'Bandra West, Mumbai',
      pincode: '400050',
      pickupDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      dimensions: '135cm W x 82cm D x 205cm H',
      weight: '160 kg',
      brand: 'Western Refrigeration',
      modelYear: '2022',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 289,
      featured: true,
      sellerId: rajesh.id,
    },
  });

  const l3 = await prisma.listing.create({
    data: {
      title: 'La Marzocco Linea Classic 2-Group Espresso Machine + Mazzer Grinder',
      description: 'Professional commercial Italian espresso workstation. Dual boilers, saturated groups, PID temperature control. Comes paired with Mazzer Super Jolly on-demand commercial burr grinder and water filtration system. Fully descaled and serviced by authorized technician last month.',
      category: 'Commercial Kitchen',
      condition: 'Like New',
      askingPrice: 215000,
      originalPrice: 580000,
      quantity: 1,
      minLotSize: 1,
      locationCity: 'Mumbai',
      locationAddress: 'Bandra West, Mumbai',
      pincode: '400050',
      pickupDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      dimensions: '70cm W x 56cm D x 45cm H',
      weight: '59 kg',
      brand: 'La Marzocco',
      modelYear: '2022',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 512,
      featured: true,
      sellerId: rajesh.id,
    },
  });

  const l4 = await prisma.listing.create({
    data: {
      title: '25x Steelcase Series 1 Ergonomic High-Back Mesh Task Chairs',
      description: 'Ergonomic office seating with LiveBack flex technology, 4D adjustable arms, pneumatic height adjustment, weight-activated synchro tilt. All mechanisms function 100%. Black frame with breathable dark grey 3D microknit mesh back. Sourced from funded tech firm office downsize in HSR Layout.',
      category: 'Office Furniture',
      condition: 'Like New',
      askingPrice: 7900,
      originalPrice: 26500,
      quantity: 25,
      minLotSize: 5,
      locationCity: 'Bangalore',
      locationAddress: 'Sector 2, HSR Layout',
      pincode: '560102',
      pickupDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      dimensions: '60cm W x 58cm D x 102cm H',
      weight: '14 kg each',
      brand: 'Steelcase',
      modelYear: '2023',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 421,
      featured: true,
      sellerId: vikram.id,
    },
  });

  const l5 = await prisma.listing.create({
    data: {
      title: '6-Seater Modular Island Workstation Pod with Soundproof Acoustic Screens',
      description: 'Spacious 6-person linear workstation pod. Pre-wired raceways with dual universal power outlets & Cat6 LAN ports per seat. Includes 3 pinnable acoustic grey felt dividers and 6 matching mobile 3-drawer lockable pedestals. Modular assembly allows easy unbolting and reinstallation.',
      category: 'Office Furniture',
      condition: 'Good',
      askingPrice: 32000,
      originalPrice: 98000,
      quantity: 4,
      minLotSize: 1,
      locationCity: 'Bangalore',
      locationAddress: 'HSR Layout Sector 2',
      pincode: '560102',
      dimensions: '360cm L x 120cm W x 115cm H',
      weight: '140 kg per pod',
      brand: 'Featherlite Modular',
      modelYear: '2022',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 310,
      featured: false,
      sellerId: vikram.id,
    },
  });

  const l6 = await prisma.listing.create({
    data: {
      title: '4x Premium Toughened Glass Island Display Showcases (With Warm LED & Locks)',
      description: 'Architect-designed retail jewelry/watch showcases. 10mm shatter-resistant toughened float glass with brushed matte black aluminum frames. Concealed warm 3000K LED edge illumination, mirrored bottom shelf, and push-button sliding lock with duplicate keys. Mint showroom condition.',
      category: 'Retail Fixtures',
      condition: 'Brand New',
      askingPrice: 13500,
      originalPrice: 38000,
      quantity: 4,
      minLotSize: 2,
      locationCity: 'Delhi NCR',
      locationAddress: 'Greater Kailash 1, New Delhi',
      pincode: '110048',
      dimensions: '120cm L x 50cm W x 95cm H',
      weight: '45 kg',
      brand: 'Showcase Studio New Delhi',
      modelYear: '2024',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 265,
      featured: true,
      sellerId: neha.id,
    },
  });

  const l7 = await prisma.listing.create({
    data: {
      title: 'Complete Posiflex Dual-Screen Touch POS Terminal + Epson Thermal Receipt Printer',
      description: 'Rugged commercial point-of-sale system: 15-inch bezel-free capacitive touch terminal + 10-inch customer-facing display. Includes genuine Epson TM-T82III high-speed thermal receipt printer and heavy gauge 5-bill cash drawer with RJ11 trigger. Windows 10 IoT enterprise pre-loaded.',
      category: 'IT & POS Hardware',
      condition: 'Refurbished',
      askingPrice: 19800,
      originalPrice: 54000,
      quantity: 3,
      minLotSize: 1,
      locationCity: 'Delhi NCR',
      locationAddress: 'Greater Kailash 1',
      pincode: '110048',
      brand: 'Posiflex & Epson',
      modelYear: '2022',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 198,
      featured: false,
      sellerId: neha.id,
    },
  });

  const l8 = await prisma.listing.create({
    data: {
      title: '2.5 Ton Godrej Heavy Duty Hydraulic Hand Pallet Truck',
      description: 'Industrial quality manual pallet jack. 2500 kg rated capacity, high tensile stamped steel chassis, leak-proof welded hydraulic pump with overload bypass valve. Heavy duty tandem polyurethane load rollers designed for smooth transit over warehouse dock plates and epoxy floors.',
      category: 'Industrial Equipment',
      condition: 'Good',
      askingPrice: 10500,
      originalPrice: 24500,
      quantity: 2,
      minLotSize: 1,
      locationCity: 'Pune',
      locationAddress: 'Chakan Industrial Zone',
      pincode: '410501',
      dimensions: '1150mm Fork Length x 550mm Width',
      weight: '78 kg',
      brand: 'Godrej Material Handling',
      modelYear: '2023',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 145,
      featured: false,
      sellerId: priya.id,
    },
  });

  const l9 = await prisma.listing.create({
    data: {
      title: '15x Heavy Duty Slotted Angle Steel Warehouse Storage Racks (5-Tiers)',
      description: 'Industrial warehouse boltless shelving units. High gauge cold-rolled steel with rust-resistant epoxy powder coating. 180 kg load capacity per shelf (900 kg total rack rating). Disassembled for easy transport, comes with all nuts, bolts, and corner gussets.',
      category: 'Industrial Equipment',
      condition: 'Like New',
      askingPrice: 2900,
      originalPrice: 7500,
      quantity: 15,
      minLotSize: 5,
      locationCity: 'Mumbai',
      locationAddress: 'Andheri East Industrial Estate',
      pincode: '400069',
      dimensions: '8ft Height x 4ft Width x 2ft Depth',
      weight: '32 kg per rack',
      brand: 'Spacetech Storage Solutions',
      modelYear: '2023',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 230,
      featured: false,
      sellerId: priya.id,
    },
  });

  const l10 = await prisma.listing.create({
    data: {
      title: 'Pitco Double Basket 20L Commercial Gas Deep Fryer with Solstice Burner',
      description: 'High-production American commercial fryer. Millivolt thermostat requiring no electric connection. Patented Solstice atmospheric burner tubes provide rapid heat recovery. Stainless steel cabinet and tank with large cool zone to prolong oil life. Excellent for fast food, cloud kitchens, or sports bars.',
      category: 'Commercial Kitchen',
      condition: 'Good',
      askingPrice: 24500,
      originalPrice: 65000,
      quantity: 1,
      minLotSize: 1,
      locationCity: 'Mumbai',
      locationAddress: 'Bandra West, Mumbai',
      pincode: '400050',
      dimensions: '40cm W x 77cm D x 120cm H',
      weight: '72 kg',
      brand: 'Pitco Frialator',
      modelYear: '2022',
      gstInvoice: true,
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
      ]),
      status: 'ACTIVE',
      views: 275,
      featured: false,
      sellerId: rajesh.id,
    },
  });

  console.log('✅ Created 10 High-Detail Commercial Asset Listings');

  // 3. Create Demo Offer & Active Negotiation
  const demoOffer = await prisma.offer.create({
    data: {
      listingId: l1.id,
      buyerId: neha.id,
      offeredPrice: 1200,
      quantity: 20,
      totalAmount: 24000,
      logisticsPref: 'Buyer Pickup',
      message: 'Hi Rajesh, we love the teak chairs for our boutique waiting area in GK1. Would you accept ₹1,200/chair if we pick up 20 units this weekend with our own tempo?',
      counterPrice: 1350,
      counterMessage: 'Hi Neha! Thank you for the interest. Since original price is ₹4,500, ₹1,200 is slightly too low. I can do ₹1,350/chair for 20 chairs if you pick up by Saturday morning.',
      status: 'COUNTERED',
    },
  });

  await prisma.message.create({
    data: {
      offerId: demoOffer.id,
      senderId: neha.id,
      content: 'Hi Rajesh! Can you confirm if all 20 cushions are stain-free and whether GST tax invoice will be provided?',
      createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    },
  });

  await prisma.message.create({
    data: {
      offerId: demoOffer.id,
      senderId: rajesh.id,
      content: 'Yes Neha, 100% stain-free and dry-cleaned. Official GST tax invoice from Spice Garden Restaurant will be handed along with the gate pass.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  });

  // Watchlist entry
  await prisma.watchlist.create({
    data: {
      userId: vikram.id,
      listingId: l3.id,
    },
  });

  console.log('✅ Created Demo Negotiation Thread and Watchlist');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
