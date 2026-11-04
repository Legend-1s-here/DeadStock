'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  MapPin,
  Building2,
  Tag,
  Grid3X3,
  List,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import ListingCard from '@/components/listings/ListingCard';
import { CATEGORIES, CONDITIONS, CITIES, formatINR } from '@/lib/utils';

interface BrowseClientProps {
  initialListings: any[];
}

export default function BrowseClient({ initialListings }: BrowseClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State from URL params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get('condition') || 'All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'All');
  const [maxPrice, setMaxPrice] = useState<number>(300000);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter listings locally for ultra-fast, zero-latency responsiveness
  const filteredListings = useMemo(() => {
    return initialListings
      .filter((listing) => {
        // Search filter
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = listing.title.toLowerCase().includes(q);
          const matchDesc = listing.description.toLowerCase().includes(q);
          const matchBrand = (listing.brand || '').toLowerCase().includes(q);
          const matchCity = listing.locationCity.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchBrand && !matchCity) return false;
        }

        // Category
        if (selectedCategory !== 'All' && listing.category !== selectedCategory) {
          return false;
        }

        // Condition
        if (selectedCondition !== 'All' && listing.condition !== selectedCondition) {
          return false;
        }

        // City
        if (selectedCity !== 'All' && listing.locationCity !== selectedCity) {
          return false;
        }

        // Max price
        if (listing.askingPrice > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.askingPrice - b.askingPrice;
        if (sortBy === 'price-high') return b.askingPrice - a.askingPrice;
        if (sortBy === 'views') return b.views - a.views;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [
    initialListings,
    searchTerm,
    selectedCategory,
    selectedCondition,
    selectedCity,
    maxPrice,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedCondition('All');
    setSelectedCity('All');
    setMaxPrice(300000);
    setSortBy('newest');
  };

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'All' ||
    selectedCondition !== 'All' ||
    selectedCity !== 'All' ||
    maxPrice < 300000;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Commercial Asset Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore surplus commercial kitchen machinery, office workstations, retail fixtures, and industrial inventory.
        </p>
      </div>

      {/* Search & Action Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs mb-6 flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full flex items-center">
          <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search assets by keywords, manufacturer, or model..."
            className="w-full px-3 py-2 text-sm text-slate-900 placeholder-slate-400 bg-transparent focus:outline-hidden"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="p-1 mr-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between w-full md:w-auto gap-2 border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl border-none focus:outline-hidden"
            >
              <option value="newest">Newest Listed</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="views">Most Popular</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-400 hover:text-slate-700'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block col-span-1 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-orange-500" />
              Filter Catalog
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Sector / Category
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                  selectedCategory === 'All'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] text-slate-400">{initialListings.length}</span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = initialListings.filter((l) => l.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                      selectedCategory === cat.id
                        ? 'bg-orange-50 text-orange-700 border border-orange-200'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{cat.shortName}</span>
                    <span className="text-[10px] text-slate-400">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Condition Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Physical Condition
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCondition('All')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold ${
                  selectedCondition === 'All'
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                All Conditions
              </button>
              {CONDITIONS.map((cond) => (
                <button
                  key={cond.id}
                  onClick={() => setSelectedCondition(cond.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                    selectedCondition === cond.id
                      ? 'bg-orange-50 text-orange-700 border border-orange-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cond.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* City / Hub */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Metro City Hub
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-orange-500"
            >
              <option value="All">All Metro Cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Range Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              <span>Max Unit Price</span>
              <span className="text-orange-600">{formatINR(maxPrice)}</span>
            </div>
            <input
              type="range"
              min={2000}
              max={300000}
              step={5000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="w-full accent-orange-500 cursor-pointer h-2 bg-slate-100 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹2k</span>
              <span>₹1.5L</span>
              <span>₹3L+</span>
            </div>
          </div>
        </aside>

        {/* Listings Display Area */}
        <main className="col-span-1 md:col-span-3">
          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-4 pb-3 border-b border-slate-200">
              <span className="text-xs text-slate-400 font-semibold">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-800" />
                  </button>
                </span>
              )}
              {selectedCondition !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium">
                  {selectedCondition}
                  <button onClick={() => setSelectedCondition('All')}>
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-800" />
                  </button>
                </span>
              )}
              {selectedCity !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md text-xs font-medium">
                  {selectedCity}
                  <button onClick={() => setSelectedCity('All')}>
                    <X className="w-3 h-3 text-slate-500 hover:text-slate-800" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-orange-600 hover:underline font-bold ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between mb-4 text-xs font-semibold text-slate-500">
            <span>Showing {filteredListings.length} surplus commercial assets</span>
          </div>

          {/* Cards Grid */}
          {filteredListings.length > 0 ? (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filteredListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No matching assets found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing specific category/city filters.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Drawer Filter */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-slate-900/60 backdrop-blur-xs md:hidden">
          <div className="relative w-4/5 max-w-xs bg-white h-full p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                Condition
              </label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs"
              >
                <option value="All">All Conditions</option>
                {CONDITIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-2">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs"
              >
                <option value="All">All Cities</option>
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-orange-500 text-white font-bold text-xs rounded-xl"
            >
              Apply Filters ({filteredListings.length} Assets)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
