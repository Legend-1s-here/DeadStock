import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  RefreshCw,
  Building2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Coins,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import ListingCard from '@/components/listings/ListingCard';
import QuickValuatorWidget from '@/components/ai/QuickValuatorWidget';
import { CATEGORIES } from '@/lib/utils';

export const revalidate = 0; // Dynamic data

export default async function HomePage() {
  // Fetch featured and recent active listings
  const featuredListings = await prisma.listing.findMany({
    where: { status: 'ACTIVE' },
    take: 6,
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
    include: {
      seller: {
        select: {
          id: true,
          businessName: true,
          city: true,
          verified: true,
          rating: true,
        },
      },
    },
  });

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tag Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-orange-400 text-xs font-bold tracking-wide shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />
              <span>India&apos;s #1 Dedicated B2B Commercial ReCommerce Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Turn Dead Assets Into{' '}
              <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                Live Capital.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              When businesses close, relocate, or upgrade, don&apos;t surrender equipment to scrap dealers for pennies. Trade directly with verified commercial buyers in bulk lots at fair market value.
            </p>

            {/* Search Bar Form */}
            <form
              action="/browse"
              method="GET"
              className="mt-8 max-w-2xl mx-auto bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl border border-slate-200/80 flex flex-col sm:flex-row gap-2"
            >
              <div className="relative flex-1 flex items-center">
                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                <input
                  type="text"
                  name="search"
                  placeholder="Search assets: 'teak chairs', 'chiller', 'workstations'..."
                  className="w-full px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden font-medium"
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  name="category"
                  className="px-3 py-2.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border-none focus:outline-hidden"
                >
                  <option value="All">All Categories</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.shortName}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Trending Quick Search Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-500">Popular:</span>
              {[
                'Restaurant Chairs',
                '4-Door Commercial Chiller',
                'Ergonomic Mesh Chairs',
                'Espresso Machine',
                'Glass Display Showcases',
                'Pallet Jacks',
              ].map((term) => (
                <Link
                  key={term}
                  href={`/browse?search=${encodeURIComponent(term)}`}
                  className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE PLATFORM METRICS */}
      <section className="bg-slate-950 border-y border-slate-800 py-6 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-black text-orange-400 block">₹1.8 Cr+</span>
              <span className="text-xs text-slate-400 font-medium">Commercial Assets Listed</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-white block">420+</span>
              <span className="text-xs text-slate-400 font-medium">Verified GST Merchants</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">91.4%</span>
              <span className="text-xs text-slate-400 font-medium">Liquidation Success Rate</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black text-blue-400 block">&lt; 72 hrs</span>
              <span className="text-xs text-slate-400 font-medium">Avg. Time to First Offer</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED COMMERCIAL ASSETS */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Verified Commercial Inventory</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                Latest Available Asset Lots
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Inspected bulk equipment and commercial furniture ready for immediate pickup.
              </p>
            </div>

            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-orange-600 transition-colors shrink-0"
            >
              <span>Explore All Listings ({featuredListings.length}+)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE AI VALUATOR WIDGET */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickValuatorWidget />
        </div>
      </section>

      {/* 5. CATEGORIES BROWSER */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              Browse by Industry Sector
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Discover commercial equipment, specialized machinery, and full workplace setups.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/browse?category=${encodeURIComponent(cat.id)}`}
                className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-orange-50 group-hover:bg-orange-500 text-orange-600 group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-orange-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="text-orange-600">{cat.count}+ Assets Available</span>
                  <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-orange-600">
                    Browse Sector <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. COMPARISON: DEADSTOCK VS KABADIWALA VS CONSUMER CLASSIFIEDS */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              The B2B Advantage
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              Why Businesses Choose DeadStock
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Traditional alternatives cost business owners thousands of rupees in lost capital and wasted hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Scrap Dealers */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-rose-600 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Local Scrap Dealers (Kabadiwalas)
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">5% – 10% Capital Recovery</h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Buys solely by weight as scrap metal, ignoring functional condition.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Exploits imminent lease deadlines with predatory low-ball pricing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Zero formal GST invoicing or corporate tax documentation.</span>
                </li>
              </ul>
            </div>

            {/* Consumer Classifieds */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-amber-600 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                Consumer Classifieds (OLX, FB)
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">High Effort, Zero Bulk</h3>
              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Flooded with retail buyers wanting 1 chair instead of whole lot of 40.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>Endless ghosting, spam messages, and UPI payment scams.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>No commercial freight coordination or lease clearance guarantee.</span>
                </li>
              </ul>
            </div>

            {/* DeadStock */}
            <div className="bg-gradient-to-b from-orange-50 to-white rounded-2xl p-6 border-2 border-orange-500 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black uppercase px-3 py-1 rounded-bl-xl">
                Recommended
              </div>
              <div className="text-orange-600 font-bold text-sm uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                DeadStock B2B Marketplace
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-3">40% – 70% Real Capital Value</h3>
              <ul className="space-y-2.5 text-xs text-slate-700 font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>100% Verified GST Business entities transacting in bulk lots.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>AI Dynamic Asset Valuation protects your CapEx depreciation curve.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>2-way counter-offer engine + integrated freight assistance.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. HOW IT WORKS */}
      <section id="how-it-works" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
              Simple 3-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">
              How DeadStock Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-orange-400 font-black text-lg flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Snap & AI Auto-Estimate</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload room photos. Our Gemini AI engine estimates condition, bulk quantities, and fair market resale pricing in under 60 seconds.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-orange-400 font-black text-lg flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Receive Direct B2B Bids</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Nearby businesses submit verified bulk purchase proposals. Accept, counter-offer, or bundle multiple lots with a single click.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center relative">
              <div className="w-12 h-12 rounded-full bg-slate-900 text-orange-400 font-black text-lg flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-2">Clear Space & Recover Cash</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hand over commercial fixtures with GST tax receipts before your lease expires, beating landlord deposit penalties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CASE STUDY: RAJESH KUMAR */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 text-xs text-orange-400 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" />
                  Verified Case Study • Mumbai
                </div>
                <blockquote className="text-lg sm:text-xl font-medium text-slate-200 leading-relaxed">
                  &ldquo;When our Bandra cafe lease came up, scrap brokers offered just ₹12,000 for all our solid teak chairs and Western chiller. On DeadStock, we closed a direct bulk deal with a new cloud kitchen within 4 days for <strong>₹1,06,000</strong> with full GST billing. It literally funded our next kitchen deposit.&rdquo;
                </blockquote>
                <div className="pt-2">
                  <p className="font-bold text-white text-base">Rajesh Kumar</p>
                  <p className="text-xs text-slate-400">Owner, Spice Garden Restaurant & Cafe (Mumbai)</p>
                </div>
              </div>

              <div className="md:col-span-4 bg-slate-800/80 rounded-2xl p-6 border border-slate-700/80 text-center space-y-3">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  Capital Preserved
                </span>
                <span className="text-3xl sm:text-4xl font-black text-emerald-400 block">
                  +₹94,000
                </span>
                <p className="text-xs text-slate-300">
                  Recovered vs. unorganized kabadiwala scrap offer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CTA BANNER */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-amber-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Have Commercial Space That Needs Vacating This Month?
          </h2>
          <p className="text-orange-100 text-base max-w-xl mx-auto">
            List your surplus business assets in 2 minutes. Start receiving bids from verified commercial buyers before your lease runs out.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/listings/new"
              className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-bold rounded-xl shadow-xl transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5 text-orange-400" />
              <span>List Your Assets Now</span>
            </Link>
            <Link
              href="/ai-valuator"
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all border border-white/30"
            >
              Calculate Asset Valuation Free
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
