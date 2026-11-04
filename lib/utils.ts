import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (amount == null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(0)}k`;
  }
  return `₹${amount}`;
}

export function calculateDiscount(askingPrice: number, originalPrice: number): number {
  if (!originalPrice || originalPrice <= askingPrice) return 0;
  return Math.round(((originalPrice - askingPrice) / originalPrice) * 100);
}

export const CATEGORIES = [
  {
    id: 'Commercial Kitchen',
    name: 'Commercial Kitchen & F&B',
    shortName: 'Commercial Kitchen',
    icon: 'UtensilsCrossed',
    description: 'Fryers, stainless tables, walk-in chillers, espresso machines & ovens',
    count: 28,
  },
  {
    id: 'Retail Fixtures',
    name: 'Retail Fixtures & Displays',
    shortName: 'Retail Displays',
    icon: 'Store',
    description: 'Glass showcases, cash counters, mannequins, gondolas & POS units',
    count: 19,
  },
  {
    id: 'Office Furniture',
    name: 'Office Furniture & Workstations',
    shortName: 'Office Furniture',
    icon: 'Briefcase',
    description: 'Ergonomic mesh chairs, 6-seat modular pods, conference tables & cabins',
    count: 34,
  },
  {
    id: 'IT & POS Hardware',
    name: 'Commercial IT & Networking',
    shortName: 'IT & Hardware',
    icon: 'Monitor',
    description: 'Thermal receipt printers, barcode scanners, server racks & monitors',
    count: 22,
  },
  {
    id: 'Industrial Equipment',
    name: 'Warehouse & Industrial Equipment',
    shortName: 'Warehouse & Heavy',
    icon: 'Warehouse',
    description: 'Hydraulic pallet jacks, heavy slotted angle shelving & strapping tools',
    count: 14,
  },
] as const;

export const CONDITIONS = [
  { id: 'Brand New', label: 'Brand New / Unused', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'Like New', label: 'Like New (Minor Wear)', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: 'Good', label: 'Good (Fully Operational)', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'Refurbished', label: 'Refurbished / Serviced', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: 'Liquidation / As-Is', label: 'Liquidation / As-Is', color: 'bg-rose-50 text-rose-700 border-rose-200' },
] as const;

export const CITIES = [
  'Mumbai',
  'Delhi NCR',
  'Bangalore',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
] as const;

export const BUSINESS_TYPES = [
  'F&B / Restaurant / Cafe',
  'Retail Store / Boutique',
  'IT / SaaS / Office',
  'Coworking Space',
  'Logistics / Warehouse',
  'Commercial Landlord',
  'Other',
] as const;

export const SAMPLE_ASSET_IMAGES = [
  {
    category: 'Commercial Kitchen',
    name: 'Stainless Steel Double Deep Fryer',
    url: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Commercial Kitchen',
    name: 'Commercial 4-Door Upright Chiller',
    url: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Commercial Kitchen',
    name: 'Italian 2-Group Commercial Espresso Machine',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Office Furniture',
    name: 'High-Back Ergonomic Breathable Mesh Chairs',
    url: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Office Furniture',
    name: '6-Seater Modular Office Workstation Island',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Retail Fixtures',
    name: 'Tempered Glass Retail Display Island with Lock',
    url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'IT & POS Hardware',
    name: 'Dual-Screen Touch POS Terminal & Thermal Printer',
    url: 'https://images.unsplash.com/photo-1556742049-0a67e557224f?auto=format&fit=crop&w=800&q=80',
  },
  {
    category: 'Industrial Equipment',
    name: '2.5 Ton Heavy Duty Hydraulic Hand Pallet Truck',
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
  },
];
